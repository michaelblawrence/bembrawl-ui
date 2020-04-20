export interface HostConnectionConfig {
  promptReconnect?: () => void;
  keepAliveUrl: string;
  registerUrl: string;
}
