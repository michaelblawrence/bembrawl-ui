export enum PageState {
  JoinRoom = "JoinRoom",
  WaitingRoom = "WaitingRoom",
  SetPrompt = "SetPrompt",
  PlayersAnswer = "PlayersAnswer",
  PlayersAnswerReview = "PlayersAnswerReview",
  PlayersGuessingPage = "PlayersGuessingPage"
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

export interface SubmitPromptMatchMessage {
  promptAnswer: string;
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
  CorrectGuess: MessageSetter<SubmitPromptMatchMessage>;
  WrongGuess: MessageSetter<SubmitPromptMatchMessage>;
  SubmitEmojiAnswer: MessageSetter<SubmitEmojiAnswerMessage>;
  SubmitEmojiVotes: MessageSetter<SubmitEmojiVotesMessage>;
};

export const DefaultMessages: Messages = {
  JoinRoom: () => {},
  CloseRoom: () => {},
  ChangePlayerName: () => {},
  SubmitNewPrompt: () => {},
  CorrectGuess: () => {},
  WrongGuess: () => {},
  SubmitEmojiAnswer: () => {},
  SubmitEmojiVotes: () => {},
};
