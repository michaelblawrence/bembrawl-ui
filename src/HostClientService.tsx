import { PageState } from "./mobile/enums/PageState";
import { setTimeout } from "timers";
import { HttpClient } from "./core/utils/HttpClient";
import {
  HostClientConnection,
  ConnectionInfo,
  ConnectionHealthTracker,
  PageSetter,
} from "./HostClientConnection";

export class PlayersClientConstants {
  public static readonly URL_API_ROOT = "http://192.168.1.66:4000/api/v2";
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
  public static readonly URL_API_ROUTE_JOIN_ROOM = "/players/join";
}

interface JoinRoomRequest {
  roomId: string;
  sessionId: string;
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: PageSetter | null = null;
  private currentPage: PageState | null = null;

  constructor() {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayersClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayersClientConstants.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.JoinRoom),
    });
  }

  public async connect() {
    const info = await this.connection.connect();
    this.connectionInfo = info;
  }

  public dispose() {
    if (this.pageStatusHandle) {
      clearInterval(this.pageStatusHandle);
      this.pageStatusHandle = null;
    }
    this.connection.dispose();
  }

  public async joinRoom(roomId: string): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const joinSuccess = await HttpClient.postJson<JoinRoomRequest, boolean>(
        PlayersClientConstants.URL_API_ROUTE_JOIN_ROOM,
        {
          roomId: roomId,
          sessionId: this.connectionInfo.sessionGuid,
        }
      );
      if (!joinSuccess) {
        this.transitionPage(PageState.JoinRoom);
        return false;
      }
    } catch (ex) {
      return false;
    }
    return true;
  }

  public registerPage(
    page: PageState,
    setPage: React.Dispatch<React.SetStateAction<PageState>>
  ) {
    if (page === PageState.WaitingRoom) {
      const timeoutHandle: any = setTimeout(
        () => setPage(PageState.PlayersAnswer),
        1000
      );
      this.pageStatusHandle = timeoutHandle as number;
    }
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
