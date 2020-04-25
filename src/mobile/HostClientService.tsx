import { PageState } from "./enums/PageState";
import { HttpClient } from "../core/utils/HttpClient";
import {
  HostClientConnection,
  ConnectionInfo,
  ConnectionHealthTracker,
  StateSetter,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import {
  PlayerState,
  InitialPlayerState,
  LastJoinedPlayerNotification,
} from "./features/PageProps";
import { HostClientStateService } from "../core/server/HostClientStateService";
import { ClientMessage, MessageTypes } from "../core/server/server.types";

export class PlayersClientConstants {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
  public static readonly URL_API_ROUTE_JOIN_ROOM = "/players/join";
  public static readonly URL_API_ROUTE_COMPLETE_ROOM = "/players/complete";
  public static readonly URL_API_ROUTE_PLAYER_CHANGE_NAME = "/players/name";
  public static readonly TIMEOUT_ALERT_JOINED_PLAYER_MS = 8000;
}

interface JoinRoomRequest {
  roomId: string;
  sessionId: string;
}

interface CompleteRoomRequest {
  roomId: string;
  sessionId: string;
}
interface ChangePlayerNameRequest {
  playerName: string;
  sessionId: string;
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly stateService: HostClientStateService<PlayerState>;
  private readonly subscription: ClientMessageSubscription | null = null;
  private readonly client: HostClient;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: StateSetter<PageState> | null = null;
  private currentPage: PageState | null = null;

  constructor(stateSetter: StateSetter<PlayerState>) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayersClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayersClientConstants.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.JoinRoom),
    });
    this.stateService = new HostClientStateService<PlayerState>(
      InitialPlayerState,
      stateSetter
    );
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
    this.client = new HostClient();
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect(); // this info can change? do we need to register this with connection
  }

  private onMessageReceived(msg: ClientMessage) {
    switch (msg.type) {
      case MessageTypes.ROOM_READY:
        this.transitionPage(PageState.PlayersAnswer);
        break;

      case MessageTypes.JOINED_PLAYER:
        const state = this.stateService.getState();
        const playerIndex =
          msg.payload.playerJoinOrder === null
            ? -1
            : msg.payload.playerJoinOrder + 1;
        const playerName = msg.payload.playerJoinName;
        state.RoomInfo.lastJoined = {
          displayUntilMs:
            msg.payload.eventTime +
            PlayersClientConstants.TIMEOUT_ALERT_JOINED_PLAYER_MS,
          playerName: playerName || `Player ${playerIndex}`,
          eventNotificationType: msg.payload.playerNameChanged
            ? LastJoinedPlayerNotification.NameChange
            : LastJoinedPlayerNotification.Joined,
        };
        state.RoomInfo.playerCount = msg.payload.playerCount;
        this.stateService.pushState(state);
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
      if (joinResult.playerIdx != null) {
        state.PlayerInfo.playerId = joinResult.playerIdx + 1;
      }
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
  }

  public registerPage(page: PageState, setPage: StateSetter<PageState>) {
    this.pageSetter = setPage;
    this.currentPage = page;
  }

  private transitionPage(newPage: PageState) {
    console.log("transitionPage", newPage, this.pageSetter);
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
  public async completeRoom(roomId: string, sessionId: string) {
    return await HttpClient.postJson<CompleteRoomRequest, boolean>(
      PlayersClientConstants.URL_API_ROUTE_COMPLETE_ROOM,
      {
        roomId: roomId,
        sessionId,
      }
    );
  }

  public async changePlayerName(playerName: string, sessionId: string) {
    await HttpClient.postJson<ChangePlayerNameRequest, boolean>(
      PlayersClientConstants.URL_API_ROUTE_PLAYER_CHANGE_NAME,
      { playerName, sessionId }
    );
  }

  public async joinRoom(roomId: string, sessionId: string) {
    return await HttpClient.postJson<
      JoinRoomRequest,
      { success: boolean; isMaster: boolean; playerIdx: number | null }
    >(PlayersClientConstants.URL_API_ROUTE_JOIN_ROOM, {
      roomId: roomId,
      sessionId: sessionId,
    });
  }
}
