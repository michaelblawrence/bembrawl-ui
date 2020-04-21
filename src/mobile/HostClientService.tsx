import { PageState } from "./enums/PageState";
import { HttpClient } from "../core/utils/HttpClient";
import {
  HostClientConnection,
  ConnectionInfo,
  ConnectionHealthTracker,
  PageSetter,
  ClientMessage,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import { PlayerState, InitialPlayerState } from "./features/PageProps";

export class PlayersClientConstants {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
  public static readonly URL_API_ROUTE_JOIN_ROOM = "/players/join";
  public static readonly URL_API_ROUTE_COMPLETE_ROOM = "/players/complete";
}

interface JoinRoomRequest {
  roomId: string;
  sessionId: string;
}

interface CompleteRoomRequest {
  roomId: string;
  sessionId: string;
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly subscription: ClientMessageSubscription | null = null;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: PageSetter<PageState> | null = null;
  private stateSetter: React.Dispatch<React.SetStateAction<PlayerState>>;
  private currentPage: PageState | null = null;
  private playerState: PlayerState = InitialPlayerState;

  constructor(stateSetter: React.Dispatch<React.SetStateAction<PlayerState>>) {
    this.stateSetter = stateSetter;
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayersClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayersClientConstants.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.JoinRoom),
    });
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect();
  }

  private onMessageReceived(msg: ClientMessage) {
    switch (msg.type) {
      case "ROOM_READY":
        this.transitionPage(PageState.PlayersAnswer);
        break;
      case "JOINED_PLAYER":
        this.playerState.RoomInfo.lastJoined = {
          displayUntilMs: msg.payload.eventTime + 8,
          playerId: msg.payload.playerJoinOrder + 1
        }
        this.pushState();
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
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const joinResult = await HttpClient.postJson<
        JoinRoomRequest,
        { success: boolean; isMaster: boolean; playerIdx: number | null }
      >(PlayersClientConstants.URL_API_ROUTE_JOIN_ROOM, {
        roomId: roomId,
        sessionId: this.connectionInfo.sessionGuid,
      });
      if (!joinResult.success) {
        this.transitionPage(PageState.JoinRoom);
        return false;
      }
      this.playerState.PlayerInfo.isMaster = joinResult.isMaster;
      this.playerState.RoomInfo.roomId = roomId;
      this.pushState();
    } catch (ex) {
      return false;
    }
    return true;
  }

  public async closeRoom(): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const roomId = this.playerState.RoomInfo.roomId;
      if (!roomId) return false;

      const completeRoomResult = await HttpClient.postJson<
        CompleteRoomRequest,
        boolean
      >(PlayersClientConstants.URL_API_ROUTE_COMPLETE_ROOM, {
        roomId: roomId,
        sessionId: this.connectionInfo.sessionGuid,
      });

      if (!completeRoomResult) {
        this.transitionPage(PageState.WaitingRoom);
        return false;
      }
      this.playerState.RoomInfo.isJoining = true;
      this.pushState();
    } catch (ex) {
      return false;
    }
    return true;
  }

  public registerPage(
    page: PageState,
    setPage: React.Dispatch<React.SetStateAction<PageState>>
  ) {
    this.pageSetter = setPage;
    this.currentPage = page;
  }

  private pushState() {
    this.stateSetter(JSON.parse(JSON.stringify(this.playerState)));
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
