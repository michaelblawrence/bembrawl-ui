export interface ConnectionInfo {
  deviceGuid: string;
  sessionGuid: string;
}

export interface HostConnectionConfig {
  promptReconnect?: (info: ConnectionInfo) => void;
  keepAliveUrl: string;
  registerUrl: string;
}
