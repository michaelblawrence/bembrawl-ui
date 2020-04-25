import { PageState } from "./enums/PageState";
import {
  HostClientConnection,
  ConnectionInfo,
  ConnectionHealthTracker,
  StateSetter,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import { HostState, InitialHostState } from "./features/PageProps";
import { HostClientStateService } from "../core/server/HostClientStateService";
import { MessageTypes, ClientMessage } from "../core/server/server.types";
import { HttpClient } from "../core/utils/HttpClient";

export class HostClientConstants {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/hosts/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/hosts/keepalive";
  public static readonly URL_API_ROUTE_EMOJI_REGISTER = "/emoji/register";
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly stateService: HostClientStateService<HostState>;
  private readonly subscription: ClientMessageSubscription;
  private readonly client: HostClient;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: StateSetter<PageState> | null = null;
  private currentPage: PageState | null = null;

  constructor(stateSetter: React.Dispatch<React.SetStateAction<HostState>>) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.stateService = new HostClientStateService<HostState>(
      InitialHostState,
      stateSetter
    );
    this.connection = new HostClientConnection({
      registerUrl: HostClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: HostClientConstants.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.WaitingForUsers),
    });
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
    this.client = new HostClient();
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect();
  }

  private onMessageReceived(msg: ClientMessage) {
    const state = this.stateService.getState();
    switch (msg.type) {
      case MessageTypes.CONNECT_SUCCESS:
        state.RoomInfo.roomId = msg.payload.joinId;
        this.stateService.pushState(state);
        break;
      case MessageTypes.PLAYER_LIST:
        state.RoomInfo.players = msg.payload.players.map((player) => {
          const playerIndex = player.playerId === null ? -1 : player.playerId + 1;
          return {
            playerIndex,
            playerName: player.playerName || `Player ${playerIndex}`,
          };
        });
        this.stateService.pushState(state);
        break;
      case MessageTypes.ROOM_READY:
        this.registerEmojiGame();
        break;
      case MessageTypes.EMOJI_GAME_STARTED:
        const { initialPromptPlayer } = msg.payload;
        const promptPlayerId =
          initialPromptPlayer.playerId === null
            ? -1
            : initialPromptPlayer.playerId + 1;
        state.EmojiGame.Question.PromptPlayerName =
          initialPromptPlayer.playerName || `Player ${promptPlayerId}`;
        this.stateService.pushState(state);
        this.transitionPage(PageState.PlayersWaitingRoom);
        break;
      case MessageTypes.EMOJI_NEW_PROMPT:
        state.EmojiGame.Question = {
          TimeoutMs: msg.payload.timeoutMs,
          Prompt: msg.payload.promptText,
        }
        this.stateService.pushState(state);
        this.transitionPage(PageState.Question);
        break;
      case MessageTypes.EMOJI_ALL_RESPONSES:
        state.EmojiGame.PlayerAnswers = msg.payload.emojiResponses.map(emojiResponse => (
          {answer: emojiResponse.responseEmoji.join(""), playerIndex: undefined, playerId: emojiResponse.playerId, votes: undefined}
        ));
        this.stateService.pushState(state);
        this.transitionPage(PageState.Answers);
        break;
      case MessageTypes.EMOJI_VOTING_RESULTS:
        for (const playerAnswer of state.EmojiGame.PlayerAnswers || []) {
          const playerVotes = msg.payload.votes.find(info => (info.playerId === playerAnswer.playerId));
          playerAnswer.votes = playerVotes?.voteCount;
        }
        this.stateService.pushState(state);
        this.transitionPage(PageState.Results);
        break;
    }
  }

  private async registerEmojiGame() {
    const { RoomInfo } = this.stateService.getState();
    if (!RoomInfo.roomId) {
      console.error("register game without room id");
      return this.transitionPage(PageState.WaitingForUsers);
    }

    const success = await this.client.emojiRegister(RoomInfo.roomId);
    if (!success) {
      console.error("register failed");
      this.connection.reconnect();
      return this.transitionPage(PageState.WaitingForUsers);
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

  public registerPage(
    page: PageState,
    setPage: React.Dispatch<React.SetStateAction<PageState>>
  ) {
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

export class HostClient {
  public async emojiRegister(roomId: number) {
    return await HttpClient.postJson(
      HostClientConstants.URL_API_ROUTE_EMOJI_REGISTER,
      {
        joinId: roomId,
      }
    );
  }
}
