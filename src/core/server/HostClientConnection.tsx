import { uuidv4 } from "../utils/uuidv4";
import { setTimeout } from "timers";
import { HttpClient } from "../utils/HttpClient";
import { asyncWait } from "../utils/asyncWait";
import { HostConnectionConfig } from "../configs/HostConnectionConfig";
import { ClientMessage, MessageTypes } from "./server.types";

export type StateSetter<TPageState> = React.Dispatch<
  React.SetStateAction<TPageState>
>;

export interface RegisterClientRequest {
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
  public static readonly INTERVAL_API_KEEPALIVE = 2000;
}

export type ClientMessageObserver = (message: ClientMessage) => void;
export type ClientMessageSubscription = { unsubscribe: () => void };

export class HostClientConnection {
  private readonly deviceGuid: string;
  private readonly sessionGuid: string;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly observers: Set<ClientMessageObserver>;
  private readonly config: HostConnectionConfig;
  private connected: boolean = false;
  private keepAliveHandle: any;

  constructor(config: HostConnectionConfig) {
    this.deviceGuid = this.getPersistentGuid();
    this.sessionGuid = this.getSessionId();
    this.config = config;
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.observers = new Set<ClientMessageObserver>();
  }

  public async connect(): Promise<ConnectionInfo> {
    if (this.connected) {
      console.warn("connect() called but already connected");
      return this.getConnectionIds();
    }

    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const resp = await HttpClient.postJson<RegisterClientRequest, any>(
        this.config.registerUrl,
        {
          deviceId: this.deviceGuid,
          sessionId: this.sessionGuid,
          // TODO: add roomid to rejoin?
        }
      );
      this.pushMessageToObservers({
        type: MessageTypes.CONNECT_SUCCESS,
        payload: { joinId: (resp || {}).joinId },
      });
    } catch (ex) {
      if (this.shouldRetry("Can't call connect on server")) {
        await asyncWait(HostClientConstants.INTERVAL_API_RECONNECT);
        return await this.connect();
      } else {
        alert("Lost connection to server. Please try refreshing to reconnect.");
        this.promptReconnect();
        throw ex;
      }
    }
    this.connectionHealthTracker.addSuccessfulAttempt();
    this.startPeriodicKeepAlive();
    this.connected = true;
    return this.getConnectionIds();
  }

  public subscribe(action: ClientMessageObserver): ClientMessageSubscription {
    this.observers.add(action);
    return {
      unsubscribe: () => this.observers.delete(action),
    };
  }

  private getConnectionIds(): ConnectionInfo {
    return {
      deviceGuid: this.deviceGuid,
      sessionGuid: this.sessionGuid,
    };
  }

  public dispose() {
    if (this.keepAliveHandle) {
      clearInterval(this.keepAliveHandle);
      this.keepAliveHandle = null;
    }
  }

  public reconnect() {
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
        messages?: ClientMessage[];
      } = await HttpClient.postJson(this.config.keepAliveUrl, {
        sessionId: this.sessionGuid,
      });
      this.connectionHealthTracker.addSuccessfulAttempt();
      if (!resp || !resp.valid) {
        console.warn("Lost connection to party");
        this.promptReconnect();
        return false;
      }
      if (resp.messages) {
        for (const msg of resp.messages) {
          this.pushMessageToObservers(msg);
        }
      }
    } catch {
      this.shouldRetry("Couldn't do healthcheck");
      return false;
    }
    return true;
  }

  private pushMessageToObservers(msg: ClientMessage) {
    this.observers.forEach((observer) => observer(msg));
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
