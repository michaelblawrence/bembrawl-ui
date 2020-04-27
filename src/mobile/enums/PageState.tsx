export enum PageState {
  JoinRoom,
  WaitingRoom,
  SetPrompt,
  PlayersAnswer,
  PlayersAnswerReview,
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

export interface SubmitNewPromptMessage {
  promptResponse: string;
  promptSubject: string;
}

export interface SubmitEmojiAnswerMessage {
  emoji: string[];
}

export interface SubmitEmojiVotesMessage {
  playerIdVotes: [string, number][];
}

export const Nothing = { payload: {} };
export interface EmptyMessage {}

export type Messages = {
  JoinRoom: MessageSetter<JoinRoomMessage>;
  CloseRoom: MessageSetter<EmptyMessage>;
  ChangePlayerName: MessageSetter<ChangePlayerNameMessage>;
  SubmitNewPrompt: MessageSetter<SubmitNewPromptMessage>;
  SubmitEmojiAnswer: MessageSetter<SubmitEmojiAnswerMessage>;
  submitEmojiVotes: MessageSetter<SubmitEmojiVotesMessage>;
};
