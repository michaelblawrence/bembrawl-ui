import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Readonly<Messages>;
  state: Readonly<PlayerState>;
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
      SubjectChoices: string[];
      EmojiCount: number;
      SecretGame: boolean;
      EmojiInputRequired: boolean;
      Secret?: string;
      TimeoutMs?: number;
    };
    AnswerEmoji?: EmojiAnswer[];
    promptPlayerAnswersEmoji?: boolean;
    maxAvailableVotes?: number;
  };
  PlayerInfo: {
    isMaster: boolean;
    playerId?: number;
    playerName?: string;
  };
  RoomInfo: {
    roomId?: string;
    isJoining: boolean;
    isOpen?: boolean;
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
      EmojiCount: 4,
      SubjectChoices: [
        "Song name",
        "Film name",
        "Historic Figures",
        "Someone in the room",
        "Something in the room",
      ],
      SecretGame: true,
      EmojiInputRequired: false,
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
