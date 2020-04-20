import { PageState } from "./enums/PageState";
import {
  HostClientConnection,
  ConnectionInfo,
  ConnectionHealthTracker,
  PageSetter,
} from "../core/server/HostClientConnection";

export class PlayersClientConstants {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/hosts/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/hosts/keepalive";
}

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: PageSetter<PageState> | null = null;
  private currentPage: PageState | null = null;

  constructor() {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayersClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayersClientConstants.URL_API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.WaitingForUsers),
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
