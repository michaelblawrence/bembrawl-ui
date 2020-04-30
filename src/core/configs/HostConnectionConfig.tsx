export interface ConnectionInfo {
  deviceGuid: string;
  accessToken: string | null;
}

export interface HostConnectionConfig {
  promptReconnect?: (info: ConnectionInfo) => void;
  keepAliveUrl: string;
  registerUrl: string;
}
