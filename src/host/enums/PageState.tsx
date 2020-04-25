export enum PageState {
  WaitingForUsers,
  Question,
  Answers,
  Results,
  FinalResults

}

export interface Message<T> {
  payload: T;
}

export type MessageSetter<T> = (msg: Message<T>) => void;

export type Messages = {
};
