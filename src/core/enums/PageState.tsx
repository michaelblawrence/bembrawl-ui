export enum PageState {
  JoinRoom,
  WaitingRoom,
  PlayersAnswer,
}

export interface Message<T> {
  payload: T;
}

export type MessageSetter<T> = (msg: Message<T>) => void;

export interface JoinRoomMessage {
  roomId: string;
}

export type Messages = {
  JoinRoom: MessageSetter<JoinRoomMessage>;
};
