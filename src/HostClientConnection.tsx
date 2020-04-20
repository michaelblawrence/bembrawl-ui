// move to core
import { uuidv4 } from "./core/utils/uuidv4";
import { setTimeout } from "timers";
import { HttpClient } from "./core/utils/HttpClient";
import { asyncWait } from "./core/utils/asyncWait";
import { HostConnectionConfig } from "./HostConnectionConfig";
import { PageState } from "./mobile/enums/PageState";

export type PageSetter = React.Dispatch<React.SetStateAction<PageState>>;

export interface RegisterPlayerRequest {
  deviceId: string;
  sessionId: string;
}

export interface ConnectionInfo {
    deviceGuid: string;
    sessionGuid: string;
}

class HostClientConstants {
  public static readonly LOCAL_STORAGE_GUID = "GUID";
  public static readonly MAX_API_ATTEMPTS = 5;
  public static readonly INTERVAL_API_RECONNECT = 4000;
  public static readonly INTERVAL_API_KEEPALIVE = 5000;
}

export class HostClientConnection {
  private readonly deviceGuid: string;
  private readonly sessionGuid: string;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly config: HostConnectionConfig;
  private connected: boolean = false;
  private keepAliveHandle: any;

  constructor(config: HostConnectionConfig) {
    this.deviceGuid = this.getPersistentGuid();
    this.sessionGuid = this.getSessionId();
    this.config = config;
    this.connectionHealthTracker = new ConnectionHealthTracker();
  }

  public async connect(): Promise<ConnectionInfo> {
    if (this.connected) {
      console.warn("connect() called but already connected");
      return this.getConnectionIds();
    }

    this.connectionHealthTracker.addConnectionAttempts();
    try {
      await HttpClient.postJson<RegisterPlayerRequest, never>(
        this.config.registerUrl,
        {
          deviceId: this.deviceGuid,
          sessionId: this.sessionGuid,
        }
      );
    } catch (ex) {
      if (this.shouldRetry("Can't call connect on server")) {
        await asyncWait(HostClientConstants.INTERVAL_API_RECONNECT);
        return await this.connect();
      } else {
        alert("Lost connection to server. Please try refreshing to reconnect.");
        throw ex;
      }
    }
    this.connectionHealthTracker.addSuccessfulAttempt();
    this.startPeriodicKeepAlive();
    this.connected = true;
    return this.getConnectionIds();
  }

  private getConnectionIds(): ConnectionInfo {
    return {
      deviceGuid: this.deviceGuid,
      sessionGuid: this.deviceGuid,
    };
  }

  public dispose() {
    if (this.keepAliveHandle) {
      clearInterval(this.keepAliveHandle);
      this.keepAliveHandle = null;
    }
  }

  private reconnect() {
    this.connected = false;
    this.connect();
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

  private getSessionId(): string {
    return "SIDv1|" + uuidv4();
  }

  private shouldRetry(errorMsg: string): boolean {
    console.warn(errorMsg);
    if (this.connectionHealthTracker.hasExceededAttempts()) {
      console.warn(errorMsg.trim() + " after multiple attempts");
      this.promptReconnect();
      return false;
    }
    return true;
  }

  private startPeriodicKeepAlive() {
    if (this.keepAliveHandle) {
      clearTimeout(this.keepAliveHandle);
      this.keepAliveHandle = null;
    }
    this.keepAliveHandle = setTimeout(() => {
      try {
        this.getServerHealth().then((isHealthy) => {
          if (isHealthy === false) {
            this.reconnect();
            return;
          }
          this.startPeriodicKeepAlive();
        });
      } catch {
        this.startPeriodicKeepAlive();
      }
    }, HostClientConstants.INTERVAL_API_KEEPALIVE);
  }

  private async getServerHealth(): Promise<boolean> {
    try {
      this.connectionHealthTracker.addConnectionAttempts();
      const resp: {
        valid: boolean;
        data?: {
          type: string;
          payload: any;
        };
      } = await HttpClient.postJson(this.config.keepAliveUrl, {
        sessionId: this.sessionGuid,
      });
      this.connectionHealthTracker.addSuccessfulAttempt();
      if (!resp || !resp.valid) {
        console.warn("Lost connection to party");
        this.promptReconnect();
        return false;
      }
    } catch {
      this.shouldRetry("Couldn't do healthcheck");
      return false;
    }
    return true;
  }

  private promptReconnect() {
    if (this.config.promptReconnect) {
      this.config.promptReconnect();
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
