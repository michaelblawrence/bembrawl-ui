import { HttpClient } from "../core/utils/HttpClient";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";

export class PlayerClientRoutes {
  public static readonly API_PLAYER_REGISTER = "/players/register";
  public static readonly API_KEEP_ALIVE = "/players/keepalive";
  public static readonly API_JOIN_ROOM = "/players/join";
  public static readonly API_COMPLETE_ROOM = "/players/complete";
  public static readonly API_PLAYER_CHANGE_NAME = "/players/name";
  public static readonly API_EMOJI_NEW_PROMPT = "/emoji/prompt";
  public static readonly API_EMOJI_NEW_RESPONSE = "/emoji/response";
  public static readonly API_EMOJI_NEW_VOTES = "/emoji/votes";
  public static readonly API_GUESSFIRST_NEW_RESPONSE = "/guessfirst/response";
  public static readonly API_GUESSFIRST_WRONG = "/guessfirst/wrong";
  public static readonly API_GUESSFIRST_PROMPT_MATCH = "/guessfirst/match";
}

export class RoomPlayerClient {
  public async joinRoom(roomId: string, info: ConnectionInfo) {
    return await HttpClient.postJson<JoinRoomRequest, JoinRoomResp>(
      PlayerClientRoutes.API_JOIN_ROOM,
      { roomId: roomId },
      info.accessToken
    );
  }
  public async completeRoom(roomId: string, info: ConnectionInfo) {
    return await HttpClient.postJson<CompleteRoomRequest, boolean>(
      PlayerClientRoutes.API_COMPLETE_ROOM,
      { roomId: roomId },
      info.accessToken
    );
  }
  public async changePlayerName(playerName: string, info: ConnectionInfo) {
    return await HttpClient.postJson<ChangePlayerNameRequest, boolean>(
      PlayerClientRoutes.API_PLAYER_CHANGE_NAME,
      { playerName },
      info.accessToken
    );
  }
}
export class EmojiPlayerClient {
  public async newPrompt(
    playerPrompt: string,
    promptSubject: string,
    info: ConnectionInfo
  ) {
    await HttpClient.postJson<NewPromptReq, boolean>(
      PlayerClientRoutes.API_EMOJI_NEW_PROMPT,
      { playerPrompt, promptSubject },
      info.accessToken
    );
  }
  public async newEmojiResponse(emoji: string[], info: ConnectionInfo) {
    return await HttpClient.postJson<NewResponseReq, boolean>(
      PlayerClientRoutes.API_EMOJI_NEW_RESPONSE,
      { responseEmoji: emoji },
      info.accessToken
    );
  }
  public async emojiVotesResponse(votes: string[], info: ConnectionInfo) {
    return await HttpClient.postJson<NewVotesReq, boolean>(
      PlayerClientRoutes.API_EMOJI_NEW_VOTES,
      { votedPlayerIds: votes },
      info.accessToken
    );
  }
}
export class GuessFirstPlayerClient {
  public async promptMatch(
    promptAnswer: string,
    promptEmoji: string[],
    promptSubject: string,
    info: ConnectionInfo
  ) {
    await HttpClient.postJson<PromptMatchGFReq, boolean>(
      PlayerClientRoutes.API_GUESSFIRST_PROMPT_MATCH,
      { promptAnswer, promptEmoji, promptSubject },
      info.accessToken
    );
  }
  public async newEmojiResponse(
    answerText: string,
    promptSubject: string,
    info: ConnectionInfo
  ) {
    return await HttpClient.postJson<NewResponseGFReq, boolean>(
      PlayerClientRoutes.API_GUESSFIRST_NEW_RESPONSE,
      { answerText, promptSubject },
      info.accessToken
    );
  }
  public async wrongGuess(
    answerText: string,
    promptSubject: string,
    info: ConnectionInfo
  ) {
    return await HttpClient.postJson<WrongAnswerGFReq, boolean>(
      PlayerClientRoutes.API_GUESSFIRST_WRONG,
      { answerText, promptSubject },
      info.accessToken
    );
  }
}

export interface PromptMatchGFReq {
  promptSubject: string;
  promptEmoji: string[];
  promptAnswer: string;
}

export interface NewResponseGFReq {
  promptSubject: string;
  answerText: string;
}

export interface WrongAnswerGFReq {
  promptSubject: string;
  answerText: string;
}

export interface JoinRoomRequest {
  roomId: string;
}

export interface JoinRoomResp {
  success: boolean;
  isMaster: boolean;
  isOpen: boolean;
  playerIdx: number | null;
  playerName: string | null;
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

export interface PromptMatchReq {
  promptSubject: string;
  promptEmoji: string;
  promptAnswer: string;
}

export interface NewResponseReq {
  responseEmoji: string[];
}

export interface NewVotesReq {
  votedPlayerIds: string[];
}
