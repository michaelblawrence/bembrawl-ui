import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  EmojiGame: { QuestionPrompt?: string };
  RoomInfo: {
    roomId?: number;
    players: {
      playerId: number;
    }[];
    lastJoined?: {
      displayUntilMs: number;
      playerId: number;
    };
  };
}

export const InitialHostState: HostState = {
  EmojiGame: {},
  RoomInfo: {
    players: [],
  },
};
