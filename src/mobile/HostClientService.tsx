import { PageState } from "./enums/PageState";
import {
  HostClientConnection,
  StateSetter,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import { ConnectionHealthTracker } from "../core/server/ConnectionHealthTracker";
import {
  PlayerState,
  InitialPlayerState,
  LastJoinedPlayerNotification,
} from "./features/PageProps";
import { HostClientStateService } from "../core/server/HostClientStateService";
import { ClientMessage, MessageTypes } from "../core/server/server.types";
import { PlayerHostClient, PlayerClientRoutes } from "./HostClient";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";

export class PlayersClientConstants {
  public static readonly TIMEOUT_ALERT_JOINED_PLAYER_MS = 8000;
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly stateService: HostClientStateService<PlayerState>;
  private readonly subscription: ClientMessageSubscription | null = null;
  private readonly client: PlayerHostClient;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: StateSetter<PageState> | null = null;
  private currentPage: PageState | null = null;

  constructor(stateSetter: StateSetter<PlayerState>) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayerClientRoutes.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayerClientRoutes.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.JoinRoom),
    });
    this.stateService = new HostClientStateService<PlayerState>(
      InitialPlayerState,
      stateSetter
    );
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
    this.client = new PlayerHostClient();
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect(); // this info can change? do we need to register this with connection
  }

  private onMessageReceived(msg: ClientMessage) {
    const state = this.stateService.getState();
    switch (msg.type) {
      case MessageTypes.ROOM_READY:
        state.RoomInfo.isJoining = false;
        this.transitionPage(PageState.WaitingRoom);
        break;

      case MessageTypes.JOINED_PLAYER:
        state.RoomInfo.playerCount = msg.payload.playerCount;
        if (
          msg.payload.playerJoinOrder === null &&
          msg.payload.playerJoinName === null
        ) {
          this.stateService.pushState(state);
          break;
        }
        const playerIndex =
          msg.payload.playerJoinOrder === null
            ? -1
            : msg.payload.playerJoinOrder + 1;
        const playerName =
          msg.payload.playerJoinName || `Player ${playerIndex}`;
        const displayTimeout =
          PlayersClientConstants.TIMEOUT_ALERT_JOINED_PLAYER_MS;

        state.RoomInfo.lastJoined = {
          displayUntilMs: msg.payload.eventTime + displayTimeout,
          playerName: playerName,
          eventNotificationType: msg.payload.playerNameChanged
            ? LastJoinedPlayerNotification.NameChange
            : LastJoinedPlayerNotification.Joined,
        };
        this.stateService.pushState(state);
        break;

      case MessageTypes.EMOJI_GAME_STARTED:
        const isPromptPlayer =
          this.connectionInfo?.deviceGuid ===
          msg.payload.initialPromptPlayer.playerId;

        state.EmojiGame.promptPlayerAnswersEmoji =
          msg.payload.promptPlayerAnswersEmoji;
        const secretGame = true;
        state.EmojiGame.Question.SecretGame = secretGame;
        state.EmojiGame.Question.EmojiInputRequired = secretGame!;
        this.stateService.pushState(state);

        if (isPromptPlayer) {
          this.transitionPage(PageState.SetPrompt);
        } else {
          this.transitionPage(PageState.WaitingRoom);
        }
        break;

      case MessageTypes.EMOJI_NEW_PROMPT:
        const wasPromptPlayer =
          this.connectionInfo?.deviceGuid === msg.payload.promptFromPlayerId;
        state.EmojiGame.Question.Subject = msg.payload.promptSubject;
        state.EmojiGame.Question.Prompt = msg.payload.promptText;
        this.stateService.pushState(state);

        if (wasPromptPlayer && !state.EmojiGame.promptPlayerAnswersEmoji) {
          this.transitionPage(PageState.WaitingRoom);
        } else {
          this.transitionPage(PageState.PlayersAnswer);
        }
        break;

      case MessageTypes.EMOJI_MATCH_PROMPT:
        const wasMatchPromptPlayer =
          this.connectionInfo?.deviceGuid === msg.payload.promptFromPlayerId;
        state.EmojiGame.Question.Subject = msg.payload.promptSubject;
        state.EmojiGame.Question.Prompt = msg.payload.promptEmoji;
        state.EmojiGame.Question.Secret = msg.payload.promptText;
        state.EmojiGame.Question.EmojiInputRequired = false;
        this.stateService.pushState(state);

        if (wasMatchPromptPlayer && !state.EmojiGame.promptPlayerAnswersEmoji) {
          this.transitionPage(PageState.WaitingRoom);
        } else {
          this.transitionPage(PageState.PlayersAnswer);
        }
        break;

      case MessageTypes.EMOJI_ALL_RESPONSES:
        state.EmojiGame.AnswerEmoji = msg.payload.emojiResponses;
        this.stateService.pushState(state);
        this.transitionPage(PageState.PlayersAnswerReview);
        break;
    }
  }

  public dispose() {
    if (this.pageStatusHandle) {
      clearInterval(this.pageStatusHandle);
      this.pageStatusHandle = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.connection.dispose();
  }

  public async joinRoom(roomId: string): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.transitionPage(PageState.WaitingRoom);
    this.connectionHealthTracker.addConnectionAttempts();

    try {
      const { sessionGuid } = this.connectionInfo;
      const joinResult = await this.client.joinRoom(roomId, sessionGuid);
      if (!joinResult.success) {
        this.transitionPage(PageState.JoinRoom);
        return false;
      }

      const state = this.stateService.getState();
      state.PlayerInfo.isMaster = joinResult.isMaster;
      state.RoomInfo.isOpen = joinResult.isOpen;
      if (joinResult.playerIdx != null) {
        state.PlayerInfo.playerId = joinResult.playerIdx + 1;
      } else {
        state.PlayerInfo.playerId = -1;
      }
      state.PlayerInfo.playerName =
        joinResult.playerName || "Player " + state.PlayerInfo.playerId;
      state.RoomInfo.roomId = roomId;
      this.stateService.pushState(state);
    } catch (ex) {
      return false;
    }
    return true;
  }

  public async closeRoom(): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const state = this.stateService.getState();
      const roomId = state.RoomInfo.roomId;
      if (!roomId) return false;

      const { sessionGuid } = this.connectionInfo;
      const success = await this.client.completeRoom(roomId, sessionGuid);
      if (!success) {
        this.transitionPage(PageState.WaitingRoom);
        return false;
      }

      state.RoomInfo.isOpen = false;
      state.RoomInfo.isJoining = true;
      this.stateService.pushState(state);
    } catch (ex) {
      return false;
    }
    return true;
  }

  public async changePlayerName(playerName: string) {
    if (!this.connectionInfo) return;

    const { sessionGuid } = this.connectionInfo;
    await this.client.changePlayerName(playerName, sessionGuid);

    const state = this.stateService.getState();
    state.PlayerInfo.playerName = playerName;
    this.stateService.pushState(state);
  }

  public async submitNewPrompt(promptResponse: string, promptSubject: string) {
    if (!this.connectionInfo) return;

    const state = this.stateService.getState();
    if (state.EmojiGame.Question.SecretGame) {
      state.EmojiGame.Question.Prompt = promptResponse;
      state.EmojiGame.Question.Subject = promptSubject;
      this.stateService.pushState(state);
      this.transitionPage(PageState.PlayersAnswer);
      return;
    }
    this.transitionPage(PageState.WaitingRoom);
    const { sessionGuid } = this.connectionInfo;
    await this.client.newPrompt(promptResponse, promptSubject, sessionGuid);
  }

  public async submitPromptMatch(
    promptAnswer: string,
    promptEmoji: string,
    promptSubject: string
  ) {
    if (!this.connectionInfo) return;

    this.transitionPage(PageState.WaitingRoom);
    const { sessionGuid } = this.connectionInfo;
    await this.client.promptMatch(
      promptAnswer,
      promptEmoji,
      promptSubject,
      sessionGuid
    );
  }

  public async submitResponseEmoji(emoji: string[]) {
    if (!this.connectionInfo) return;

    const { sessionGuid } = this.connectionInfo;
    await this.client.newEmojiResponse(emoji, sessionGuid);
    this.transitionPage(PageState.WaitingRoom);
  }

  public async submitEmojiVotes(playerIdVotes: [string, number][]) {
    if (!this.connectionInfo) return;
    this.transitionPage(PageState.WaitingRoom);

    const { sessionGuid } = this.connectionInfo;
    const votes = playerIdVotes.flatMap(([playerId, count]) =>
      new Array(count).fill(playerId)
    );
    await this.client.emojiVotesResponse(votes, sessionGuid);
  }

  public registerPage(page: PageState, setPage: StateSetter<PageState>) {
    this.pageSetter = setPage;
    this.currentPage = page;
  }

  private transitionPage(newPage: PageState) {
    if (this.pageSetter) {
      this.pageSetter(newPage);
    } else {
      console.warn(
        "wasn't registered to be able to change page. transition failed"
      );
    }
  }
}
