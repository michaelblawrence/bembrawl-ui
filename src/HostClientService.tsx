import { PageState } from "./core/enums/PageState";
import { uuidv4 } from "./core/utils/uuidv4";
import { setTimeout } from "timers";
import { HttpClient } from "./core/utils/HttpClient";
import { asyncWait } from "./core/utils/asyncWait";

export class HostClientConstants {
  public static readonly LOCAL_STORAGE_GUID = "GUID";
  public static readonly MAX_API_ATTEMPTS = 5;
  public static readonly URL_API_ROOT = "http://192.168.1.66:4000/api/v2";
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
}

interface RegisterPlayerRequest {
  deviceId: string;
  sessionId: string;
}

export class HostClientService {
  private readonly deviceGuid: string;
  private readonly sessionGuid: string;
  private readonly connectionHealthTracker: ConnectionHealthTracker;

  private pageStatusHandle: number | null = null;
  private pageSetter: React.Dispatch<
    React.SetStateAction<PageState>
  > | null = null;
  private connected: boolean = false;
  private keepAliveHandle: any;

  constructor() {
    this.deviceGuid = this.getPersistentGuid();
    this.sessionGuid = uuidv4();
    this.connectionHealthTracker = new ConnectionHealthTracker();
  }

  public async connect() {
    if (this.connected) {
      console.warn("connect() called but already connected");
      return;
    }
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      await HttpClient.postJson<RegisterPlayerRequest, never>(
        HostClientConstants.URL_API_ROUTE_PLAYER_REGISTER,
        {
          deviceId: this.deviceGuid,
          sessionId: this.sessionGuid,
        }
      );
    } catch (ex) {
      if (this.shouldRetry("Can't call connect on server")) {
        await asyncWait(2000);
        await this.connect();
        return;
      } else {
        throw ex;
      }
    }
    this.connectionHealthTracker.addSuccessfulAttempt();

    this.startPeriodicKeepAlive();
    this.connected = true;
  }

  private startPeriodicKeepAlive() {
    if (this.keepAliveHandle) {
      clearTimeout(this.keepAliveHandle);
      this.keepAliveHandle = null;
    }

    this.keepAliveHandle = setTimeout(() => {
      try {
        this.getServerHealth().then(() => this.startPeriodicKeepAlive());
      } catch {
        this.startPeriodicKeepAlive();
      }
    }, 2000);
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
  }

  public dispose() {
    if (this.pageStatusHandle) {
      clearInterval(this.pageStatusHandle);
      this.pageStatusHandle = null;
    }
  }

  private getPersistentGuid() {
    const guid = localStorage.getItem(HostClientConstants.LOCAL_STORAGE_GUID);
    if (guid) {
      return guid;
    }
    const newGuid = uuidv4();
    localStorage.setItem(HostClientConstants.LOCAL_STORAGE_GUID, newGuid);
    return newGuid;
  }

  private async getServerHealth() {
    try {
      this.connectionHealthTracker.addConnectionAttempts();
      const isHealthy: boolean = await HttpClient.postJson(
        HostClientConstants.URL_API_ROUTE_KEEP_ALIVE,
        this.sessionGuid
      );
      this.connectionHealthTracker.addSuccessfulAttempt();

      if (!isHealthy) {
        console.warn("Lost connection to party");
        this.transitionPage(PageState.JoinRoom);
      }
    } catch {
      this.shouldRetry("Couldn't do healthcheck");
    }
  }

  private shouldRetry(errorMsg: string): boolean {
    console.warn(errorMsg);
    if (this.connectionHealthTracker.hasExceededAttempts()) {
      console.warn(errorMsg.trim() + " after multiple attempts");
      this.transitionPage(PageState.JoinRoom);
      return false;
    }
    return true;
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

export class ConnectionHealthTracker {
  private connectAttempts: number = 0;

  public addSuccessfulAttempt() {
    this.connectAttempts = 0;
  }

  public addConnectionAttempts() {
    this.connectAttempts++;
  }

  public hasExceededAttempts() {
    return this.connectAttempts >= HostClientConstants.MAX_API_ATTEMPTS;
  }
}
