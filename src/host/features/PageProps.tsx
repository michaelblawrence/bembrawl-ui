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
      answer: string;
      playerId?: string;
      votes?: number;
    }[];
    GameDetails?: {
      PlayerScores: {
        playerId: string;
        playerScore: number;
      }
      CurrentRound: number;
      TotalRounds: number;
    }
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
  EmojiGame: { Question: {} },
  RoomInfo: {
    players: [],
  },
};
