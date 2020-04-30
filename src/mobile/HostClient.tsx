import { HttpClient } from "../core/utils/HttpClient";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";

export class PlayerClientRoutes {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
  public static readonly URL_API_ROUTE_JOIN_ROOM = "/players/join";
  public static readonly URL_API_ROUTE_COMPLETE_ROOM = "/players/complete";
  public static readonly URL_API_ROUTE_PLAYER_CHANGE_NAME = "/players/name";
  public static readonly URL_API_ROUTE_EMOJI_NEW_PROMPT = "/emoji/prompt";
  public static readonly URL_API_ROUTE_EMOJI_NEW_RESPONSE = "/emoji/response";
  public static readonly URL_API_ROUTE_EMOJI_NEW_VOTES = "/emoji/votes";
}

export class PlayerHostClient {
  public async completeRoom(roomId: string, info: ConnectionInfo) {
    return await HttpClient.postJson<CompleteRoomRequest, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_COMPLETE_ROOM,
      { roomId: roomId },
      info.accessToken
    );
  }
  public async changePlayerName(playerName: string, info: ConnectionInfo) {
    await HttpClient.postJson<ChangePlayerNameRequest, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_PLAYER_CHANGE_NAME,
      { playerName },
      info.accessToken
    );
  }
  public async newPrompt(
    playerPrompt: string,
    promptSubject: string,
    info: ConnectionInfo
  ) {
    await HttpClient.postJson<NewPromptReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_PROMPT,
      { playerPrompt, promptSubject },
      info.accessToken
    );
  }
  public async newEmojiResponse(emoji: string[], info: ConnectionInfo) {
    return await HttpClient.postJson<NewResponseReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_RESPONSE,
      { responseEmoji: emoji },
      info.accessToken
    );
  }
  public async emojiVotesResponse(votes: string[], info: ConnectionInfo) {
    return await HttpClient.postJson<NewVotesReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_VOTES,
      { votedPlayerIds: votes },
      info.accessToken
    );
  }
  public async joinRoom(roomId: string, info: ConnectionInfo) {
    return await HttpClient.postJson<
      JoinRoomRequest,
      {
        success: boolean;
        isMaster: boolean;
        isOpen: boolean;
        playerIdx: number | null;
        playerName: string | null;
      }
    >(
      PlayerClientRoutes.URL_API_ROUTE_JOIN_ROOM,
      { roomId: roomId },
      info.accessToken
    );
  }
}

export interface JoinRoomRequest {
  roomId: string;
}

export interface CompleteRoomRequest {
  roomId: string;
}

export interface ChangePlayerNameRequest {
  playerName: string;
}

export interface NewPromptReq {
  promptSubject: string;
  playerPrompt: string;
}

export interface NewResponseReq {
  responseEmoji: string[];
}

export interface NewVotesReq {
  votedPlayerIds: string[];
}
