import { Messages, PageState } from "../enums/PageState";

export interface PageProps {
  setPage: (page: PageState) => void;
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  PlayerInfo: {
    isMaster: boolean;
  };
  RoomInfo: {
    roomId?: number;
    isJoining: boolean;
    lastJoined?: {
        displayUntilMs: number,
        playerId: number,
    }
  };
}

export const InitialHostState: HostState = {
  PlayerInfo: {
    isMaster: false,
  },
  RoomInfo: {
    isJoining: false,
  },
};
