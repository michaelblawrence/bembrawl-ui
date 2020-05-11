import { Messages } from "../enums/PageState";
import { GameType } from "../../core/enums/GameType";
import { PlayerCorrectGuessResponse } from "../../core/server/server.types";

export interface PageProps {
  setMessage: Messages;
  state: PlayerState;
}

export enum LastJoinedPlayerNotification {
  Joined = "joined",
  NameChange = "changed name",
}

export interface PlayerState {
  EmojiGame: EmojiGameState;
  PlayerInfo: PlayerInfoState;
  RoomInfo: RoomInfoState;
}

export interface EmojiGameState {
  Question: {
    Prompt?: string;
    PromptPlayerName?: string;
    Subject?: string;
    SubjectChoices: string[];
    EmojiCount: number;
    TimeoutMs?: number;
  };
  AnswerEmoji?: EmojiAnswer[];
  GuessFirst: GuessFirstGameState;
  promptPlayerAnswersEmoji?: boolean;
  maxAvailableVotes?: number;
}

export interface GuessFirstGameState {
  Question: {
    Secret?: string;
    PromptEmoji?: string[];
  };
  notifyMessage?: string 
  Responses?: PlayerCorrectGuessResponse[];
}

export interface PlayerInfoState {
  isMaster: boolean;
  playerId?: number;
  playerName?: string;
}

export interface RoomInfoState {
  gameType: GameType;
  roomId?: string;
  isJoining: boolean;
  isOpen?: boolean;
  playerCount: number;
  lastJoined?: {
    displayUntilMs: number;
    playerName: string;
    eventNotificationType: LastJoinedPlayerNotification;
  };
}

export interface EmojiAnswer {
  playerId: string;
  responseEmoji: string[];
  sessionVotes?: number;
}

export const InitialPlayerState: PlayerState = {
  EmojiGame: {
    Question: {
      EmojiCount: 5,
      SubjectChoices: [
        "Song name",
        "Film name",
        "Someone in the room",
        "Something in the room",
      ],
    },
    GuessFirst: {
      Question: {},
    },
  },
  PlayerInfo: {
    isMaster: false,
  },
  RoomInfo: {
    gameType: GameType.None,
    isJoining: false,
    playerCount: 0,
  },
};
