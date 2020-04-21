import { Messages, PageState } from "../enums/PageState";

export interface PageProps {
  setPage: (page: PageState) => void;
  setMessage: Messages;
  state: PlayerState;
}

export interface PlayerState {
  PlayerInfo: {
    isMaster: boolean;
  };
  RoomInfo: {
    roomId?: string;
    isJoining: boolean;
    lastJoined?: {
        displayUntilMs: number,
        playerId: number,
    }
  };
}

export const InitialPlayerState: PlayerState = {
  PlayerInfo: {
    isMaster: false,
  },
  RoomInfo: {
    isJoining: false,
  },
};
