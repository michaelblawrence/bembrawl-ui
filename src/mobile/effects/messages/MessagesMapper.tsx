import {
  Messages,
  Message,
  JoinRoomMessage,
  ChangePlayerNameMessage,
  SubmitNewPromptMessage,
  SubmitPromptMatchMessage,
  SubmitEmojiAnswerMessage,
  SubmitEmojiVotesMessage,
} from "../../enums/PageState";
import { HostClientService } from "../../HostClientService";
import { EmojiPlayerService } from "../../services/EmojiPlayerService";
import { GuessFirstPlayerService } from "../../services/GuessFirstPlayerService";
import { PlayerState } from "../../features/PageProps";
import { GameType } from "../../../core/enums/GameType";

export class MessagesMapper {
  currentGameSvc: () => EmojiPlayerService | GuessFirstPlayerService;

  constructor(
    private readonly svc: HostClientService,
    private readonly state: PlayerState
  ) {
    this.currentGameSvc = () => {
      switch (this.state.RoomInfo.gameType) {
        case GameType.Emoji:
          const emojiSvc = svc.emojiSvc();
          if (!emojiSvc) throw Error("No active game instance on type!");
          return emojiSvc;
        case GameType.GuessFirst:
          const guessFirstSvc = svc.guessFirstSvc();
          if (!guessFirstSvc) throw Error("No active game instance on type!");
          return guessFirstSvc;
        default:
          throw Error("No active game set in state!");
      }
    };
  }

  public map(): Messages {
    const use = <TMsg, TRes>(fn: (msg: Message<TMsg>) => TRes) => fn.bind(this);

    return {
      JoinRoom: use(this.joinRoom),
      CloseRoom: use(this.closeRoom),
      ChangePlayerName: use(this.changePlayerName),
      SubmitNewPrompt: use(this.submitNewPrompt),
      CorrectGuess: use(this.correctGuess),
      WrongGuess: use(this.wrongGuess),
      SubmitEmojiAnswer: use(this.submitEmojiAnswer),
      SubmitEmojiVotes: use(this.submitEmojiVotes),
    };
  }

  private joinRoom({ payload: { roomId } }: Message<JoinRoomMessage>) {
    return this.svc.roomSvc()?.joinRoom(roomId);
  }

  private closeRoom() {
    return this.svc.roomSvc()?.closeRoom();
  }

  private changePlayerName({
    payload: { playerName },
  }: Message<ChangePlayerNameMessage>) {
    return this.svc.roomSvc()?.changePlayerName(playerName);
  }

  private submitNewPrompt({
    payload: { promptResponse, promptSubject },
  }: Message<SubmitNewPromptMessage>) {
    return this.currentGameSvc().submitNewPrompt(
      promptResponse,
      promptSubject
    );
  }

  private correctGuess({
    payload: { promptAnswer },
  }: Message<SubmitPromptMatchMessage>) {
    const guessFirstSvc = this.svc.guessFirstSvc();
    if (!guessFirstSvc) throw Error("No active game instance on type!");
    return guessFirstSvc.correctGuess(promptAnswer);
  }

  private wrongGuess({
    payload: { promptAnswer },
  }: Message<SubmitPromptMatchMessage>) {
    const guessFirstSvc = this.svc.guessFirstSvc();
    if (!guessFirstSvc) throw Error("No active game instance on type!");
    return guessFirstSvc.wrongGuess(promptAnswer);
  }

  private submitEmojiAnswer({
    payload: { emoji },
  }: Message<SubmitEmojiAnswerMessage>) {
    return this.currentGameSvc().submitResponseEmoji(emoji);
  }

  private submitEmojiVotes({
    payload: { playerIdVotes },
  }: Message<SubmitEmojiVotesMessage>) {
    const emojiSvc = this.svc.emojiSvc();
    if (!emojiSvc) throw Error("No active game instance on type!");
    return emojiSvc.submitEmojiVotes(playerIdVotes);
  }
}
