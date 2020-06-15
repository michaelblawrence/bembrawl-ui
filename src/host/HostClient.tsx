import { HttpClient } from "../core/utils/HttpClient";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";

export class HostClientConstants {
  public static readonly API_ROUTE_HOST_REGISTER = "/hosts/register";
  public static readonly API_ROUTE_HOST_JOIN = "/hosts/join";
  public static readonly API_ROUTE_KEEP_ALIVE = "/hosts/keepalive";
  public static readonly API_ROUTE_EMOJI_REGISTER = "/emoji/register";
  public static readonly API_GUESSFIRST_NEW_PROMPT = "/guessfirst/register";
}

export class HostClient {
  public async emojiRegister(roomId: number, info: ConnectionInfo) {
    return await HttpClient.postJson(
      HostClientConstants.API_ROUTE_EMOJI_REGISTER,
      {
        joinId: roomId,
      },
      info.accessToken
    );
  }
  public async guessFirstRegister(roomId: number, info: ConnectionInfo) {
    return await HttpClient.postJson(
      HostClientConstants.API_GUESSFIRST_NEW_PROMPT,
      {
        joinId: roomId,
      },
      info.accessToken
    );
  }
}
