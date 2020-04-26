export enum PageState {
  WaitingForUsers = "WaitingForUsers",
  PlayersWaitingRoom = "PlayersWaitingRoom",
  Question = "Question",
  Answers = "Answers",
  Results = "Results",
  EndScores = "EndScores"
}

export interface Message<T> {
  payload: T;
}

export type MessageSetter<T> = (msg: Message<T>) => void;

export type Messages = {
};
