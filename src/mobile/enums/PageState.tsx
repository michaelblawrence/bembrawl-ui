export enum PageState {
  JoinRoom,
  WaitingRoom,
  PlayersAnswer,
  PlayersAnswerReview
}

export interface Message<T> {
  payload: T;
}

export type MessageSetter<T> = (msg: Message<T>) => void;

export interface JoinRoomMessage {
  roomId: string;
}
export interface ChangePlayerNameMessage {
  playerName: string;
}

export const Nothing = { payload: {} };
export interface EmptyMessage {}

export type Messages = {
  JoinRoom: MessageSetter<JoinRoomMessage>;
  CloseRoom: MessageSetter<EmptyMessage>;
  ChangePlayerName: MessageSetter<ChangePlayerNameMessage>;
};

