import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  RoomInfo: {
    roomId?: number;
    players: {
      playerId: number;
      playerName: string;
    }[];
    lastJoined?: {
        displayUntilMs: number,
        playerId: number,
    }
  };
}

export const InitialHostState: HostState = {
  RoomInfo: {
    players: [],
  },
};
