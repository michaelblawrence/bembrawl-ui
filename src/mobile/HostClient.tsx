import { HttpClient } from "../core/utils/HttpClient";

export class PlayerClientRoutes {
  public static readonly URL_API_ROUTE_PLAYER_REGISTER = "/players/register";
  public static readonly URL_API_ROUTE_KEEP_ALIVE = "/players/keepalive";
  public static readonly URL_API_ROUTE_JOIN_ROOM = "/players/join";
  public static readonly URL_API_ROUTE_COMPLETE_ROOM = "/players/complete";
  public static readonly URL_API_ROUTE_PLAYER_CHANGE_NAME = "/players/name";
  public static readonly URL_API_ROUTE_EMOJI_NEW_PROMPT = "/emoji/prompt";
  public static readonly URL_API_ROUTE_EMOJI_PROMPT_MATCH = "/emoji/match";
  public static readonly URL_API_ROUTE_EMOJI_NEW_RESPONSE = "/emoji/response";
  public static readonly URL_API_ROUTE_EMOJI_NEW_VOTES = "/emoji/votes";
}

export class PlayerHostClient {
  public async completeRoom(roomId: string, sessionId: string) {
    return await HttpClient.postJson<CompleteRoomRequest, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_COMPLETE_ROOM,
      {
        roomId: roomId,
        sessionId,
      }
    );
  }
  public async changePlayerName(playerName: string, sessionId: string) {
    await HttpClient.postJson<ChangePlayerNameRequest, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_PLAYER_CHANGE_NAME,
      { playerName, sessionId }
    );
  }
  public async newPrompt(
    playerPrompt: string,
    promptSubject: string,
    sessionId: string
  ) {
    await HttpClient.postJson<NewPromptReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_PROMPT,
      { playerPrompt, promptSubject, sessionId }
    );
  }
  public async promptMatch(
    promptAnswer: string,
    promptEmoji: string,
    promptSubject: string,
    sessionId: string
  ) {
    await HttpClient.postJson<PromptMatchReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_PROMPT_MATCH,
      {
        promptAnswer,
        promptEmoji,
        promptSubject,
        sessionId,
      }
    );
  }
  public async newEmojiResponse(emoji: string[], sessionId: string) {
    return await HttpClient.postJson<NewResponseReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_RESPONSE,
      { responseEmoji: emoji, sessionId }
    );
  }
  public async emojiVotesResponse(votes: string[], sessionId: string) {
    return await HttpClient.postJson<NewVotesReq, boolean>(
      PlayerClientRoutes.URL_API_ROUTE_EMOJI_NEW_VOTES,
      { votedPlayerIds: votes, sessionId }
    );
  }
  public async joinRoom(roomId: string, sessionId: string) {
    return await HttpClient.postJson<
      JoinRoomRequest,
      {
        success: boolean;
        isMaster: boolean;
        isOpen: boolean;
        playerIdx: number | null;
        playerName: string | null;
      }
    >(PlayerClientRoutes.URL_API_ROUTE_JOIN_ROOM, {
      roomId: roomId,
      sessionId: sessionId,
    });
  }
}

export interface JoinRoomRequest {
  roomId: string;
  sessionId: string;
}

export interface CompleteRoomRequest {
  roomId: string;
  sessionId: string;
}

export interface ChangePlayerNameRequest {
  playerName: string;
  sessionId: string;
}

export interface NewPromptReq {
  sessionId: string;
  promptSubject: string;
  playerPrompt: string;
}

export interface PromptMatchReq {
  sessionId: string;
  promptSubject: string;
  promptEmoji: string;
  promptAnswer: string;
}

export interface NewResponseReq {
  sessionId: string;
  responseEmoji: string[];
}

export interface NewVotesReq {
  sessionId: string;
  votedPlayerIds: string[];
}
