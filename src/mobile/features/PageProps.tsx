import { Messages } from "../enums/PageState";

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
  GuessFirstGame: GuessFirstGameState;
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
  promptPlayerAnswersEmoji?: boolean;
  maxAvailableVotes?: number;
}

export interface GuessFirstGameState {
  Question: {
    Prompt?: string;
    PromptPlayerName?: string;
    Subject?: string;
    Secret?: string;
    SubjectChoices: string[];
    EmojiCount: number;
    TimeoutMs?: number;
  };
  AnswerEmoji?: EmojiAnswer[];
  promptPlayerAnswersEmoji?: boolean;
  maxAvailableVotes?: number;
}

export interface PlayerInfoState {
  isMaster: boolean;
  playerId?: number;
  playerName?: string;
}

export interface RoomInfoState {
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
  },
  GuessFirstGame: {
    Question: {
      EmojiCount: 5,
      SubjectChoices: [
        "Song name",
        "Film name",
        "Someone in the room",
        "Something in the room",
      ],
    },
  },
  PlayerInfo: {
    isMaster: false,
  },
  RoomInfo: {
    isJoining: false,
    playerCount: 0,
  },
};
