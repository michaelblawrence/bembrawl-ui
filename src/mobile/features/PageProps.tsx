import { Messages } from "../enums/PageState";

export interface PageProps {
  setMessage: Messages;
  state: PlayerState;
}

export enum LastJoinedPlayerNotification {
  Joined = 'joined',
  NameChange = 'changed name'
}

export interface PlayerState {
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
  PlayerInfo: {
    isMaster: false,
  },
  RoomInfo: {
    isJoining: false,
    playerCount: 0,
  },
};
