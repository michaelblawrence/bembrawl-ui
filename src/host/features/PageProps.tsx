import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  EmojiGame: {
    Question: {
      Prompt?: string;
      Subject?: string;
      TimeoutMs?: number;
    };
    PlayerAnswers?: {
      playerIndex: number;
      answer: string;
      votes: number;
    }[];
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
