import { ClientMessage } from "../server/server.types";
import { ConnectionInfo } from "../configs/HostConnectionConfig";

export interface CoreMessageProps<TState, TFx, TMsg extends ClientMessage> {
  state: TState;
  msg: TMsg;
  connectionInfo: ConnectionInfo;
  effects: TFx
}
