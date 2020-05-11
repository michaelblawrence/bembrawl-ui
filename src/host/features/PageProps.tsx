import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  EmojiGame: {
    Question: {
      Prompt?: string;
      PromptPlayerName?: string;
      Subject?: string;
      TimeoutMs?: number;
    };
    PlayerAnswers?: {
      playerIndex?: number; // TODO: delete when/if no longer in use
      playerId?: string;
      votes?: number;
      answerList?: string[];
    }[];
    GameDetails?: {
      PlayerScores: {
        playerId: string;
        playerScore: number;
      };
      CurrentRound: number;
      TotalRounds: number;
    };
    GuessFirst: {
      Question: {
        promptEmoji?: string[];
        secret?: string;
      };
      PlayerAnswers?: {
        playerIndex?: number; // TODO: delete when/if no longer in use
        playerId?: string;
        score?: number;
      }[];
      PlayerGuesses: { text: string }[];
    };
  };
  RoomInfo: {
    roomId?: number;
    players: {
      playerIndex: number;
      playerName: string;
    }[];
    lastJoined?: {
      displayUntilMs: number;
      playerIndex: number;
    };
  };
}

export const InitialHostState: HostState = {
  EmojiGame: {
    Question: {},
    GuessFirst: {
      Question: {},
      PlayerGuesses: [],
    },
  },
  RoomInfo: {
    players: [],
  },
};
