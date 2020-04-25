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
    PlayerAnswers?: [];
  };
  RoomInfo: {
    roomId?: number;
    players: {
      playerId: number;
      playerName: string;
    }[];
    lastJoined?: {
      displayUntilMs: number;
      playerId: number;
    };
  };
}

export const InitialHostState: HostState = {
  EmojiGame: { Question: {} },
  RoomInfo: {
    players: [],
  },
};
