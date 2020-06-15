import { uuidv4 } from "../utils/uuidv4";
import { setTimeout } from "timers";
import { HttpClient } from "../utils/HttpClient";
import { asyncWait } from "../utils/asyncWait";
import {
  HostConnectionConfig,
  ConnectionInfo,
} from "../configs/HostConnectionConfig";
import { ClientMessage, MessageTypes } from "./server.types";
import { ConnectionHealthTracker } from "./ConnectionHealthTracker";

export type StateSetter<TPageState> = React.Dispatch<
  React.SetStateAction<TPageState>
>;

export interface RegisterClientRequest {
  deviceId: string;
}

interface PlayersResp {
  deviceId: string;
  token: string;
}

export class HostClientConstants {
  public static readonly LOCAL_STORAGE_GUID = "GUID";
  public static readonly MAX_API_ATTEMPTS = 5;
  public static readonly INTERVAL_API_RECONNECT = 4000;
  public static readonly INTERVAL_API_KEEPALIVE = 2000;
}

export type ClientMessageObserver = (message: ClientMessage) => void;
export type ClientMessageSubscription = { unsubscribe: () => void };

enum ConnectionHealth {
  UnknownError,
  Unauthorized,
  Healthy,
}

export class HostClientConnection {
  private readonly deviceGuid: string;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly observers: Set<ClientMessageObserver>;
  private readonly config: HostConnectionConfig;
  private connected: boolean = false;
  private keepAliveHandle: any;

  private accessToken: string | null = null;

  constructor(config: HostConnectionConfig) {
    this.deviceGuid = this.getPersistentGuid();
    this.config = config;
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.observers = new Set<ClientMessageObserver>();
  }

  public async connect(
    registerUrl: string | null = null
  ): Promise<ConnectionInfo> {
    if (this.connected) {
      console.warn("connect() called but already connected");
      return this.getConnectionIds();
    }

    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const resp = await HttpClient.postJson<
        RegisterClientRequest,
        PlayersResp
      >(registerUrl || this.config.registerUrl, {
        deviceId: this.deviceGuid,
      });
      this.accessToken = resp.token;
      const joinId: number | undefined = ((resp as any) || {}).joinId; // fix type
      setTimeout(
        () =>
          this.pushMessageToObservers({
            type: MessageTypes.CONNECT_SUCCESS,
            payload: { joinId },
          }),
        50
      );
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
      accessToken: this.accessToken,
    };
  }

  public dispose() {
    if (this.keepAliveHandle) {
      clearInterval(this.keepAliveHandle);
      this.keepAliveHandle = null;
    }
  }

  public async reconnect(registerUrl: string | null = null) {
    this.connected = false;
    await this.connect(registerUrl);
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
    this.keepAliveHandle = setTimeout(async () => {
      try {
        const isHealthy = await this.getServerHealth();
        switch (isHealthy) {
          case ConnectionHealth.Healthy:
            this.startPeriodicKeepAlive();
            return;
          case ConnectionHealth.UnknownError:
            console.warn("ConnectionHealth=UnknownError");
            this.reconnect();
            return;
          case ConnectionHealth.Unauthorized:
            console.warn("ConnectionHealth=Unauthorized");
            this.promptReconnect();
            this.reconnect();
            return;
        }
      } catch {
        this.startPeriodicKeepAlive();
      }
    }, HostClientConstants.INTERVAL_API_KEEPALIVE);
  }

  private async getServerHealth(): Promise<ConnectionHealth> {
    try {
      this.connectionHealthTracker.addConnectionAttempts();
      const resp: {
        valid: boolean;
        messages?: ClientMessage[];
      } = await HttpClient.postJson(
        this.config.keepAliveUrl,
        {},
        this.accessToken
      );
      this.connectionHealthTracker.addSuccessfulAttempt();
      if (!resp || !resp.valid) {
        console.warn("Lost connection to party");
        return ConnectionHealth.Unauthorized;
      }
      if (resp.messages) {
        for (const msg of resp.messages) {
          this.pushMessageToObservers(msg);
        }
      }
    } catch (ex) {
      this.shouldRetry("Couldn't do healthcheck; msg=" + ex);
      // TODO: formalize HTTP403 check
      if (`${ex}`.includes(`"statusCode":403`))
        return ConnectionHealth.Unauthorized;
      return ConnectionHealth.UnknownError;
    }
    return ConnectionHealth.Healthy;
  }

  private pushMessageToObservers(msg: ClientMessage) {
    this.observers.forEach((observer) => observer(msg));
  }

  private promptReconnect() {
    if (this.config.promptReconnect) {
      const info = this.getConnectionIds();
      this.config.promptReconnect(info);
    } else {
      console.warn("could not trigger service reconnect");
    }
  }
}
