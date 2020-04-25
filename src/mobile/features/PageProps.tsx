import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: PlayerState;
}

export enum LastJoinedPlayerNotification {
  Joined = "joined",
  NameChange = "changed name",
}

export interface EmojiAnswer {
  playerId: string;
  responseEmoji: string[];
  sessionVotes?: number;
}

export interface PlayerState {
  EmojiGame: {
    Question: {
      Prompt?: string;
      PromptPlayerName?: string;
      Subject?: string;
      EmojiCount: number;
      TimeoutMs?: number;
    };
    AnswerEmoji?: EmojiAnswer[];
    promptPlayerAnswersEmoji?: boolean;
    maxAvailableVotes?: number;
  };
  PlayerInfo: {
    isMaster: boolean;
    playerId?: number;
  };
  RoomInfo: {
    roomId?: string;
    isJoining: boolean;
    playerCount: number;
    lastJoined?: {
      displayUntilMs: number;
      playerName: string;
      eventNotificationType: LastJoinedPlayerNotification;
    };
  };
}

export const InitialPlayerState: PlayerState = {
  EmojiGame: {
    Question: {
      EmojiCount: 5,
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
