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
import { PlayerState, GameType } from "../../features/PageProps";

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
      SubmitPromptMatch: use(this.submitPromptMatch),
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

  private submitPromptMatch({
    payload: { promptAnswer, promptEmoji, promptSubject },
  }: Message<SubmitPromptMatchMessage>) {
    const guessFirstSvc = this.svc.guessFirstSvc();
    if (!guessFirstSvc) throw Error("No active game instance on type!");
    return guessFirstSvc.submitPromptMatch(promptAnswer, promptEmoji, promptSubject);
  }

  private submitEmojiAnswer({
    payload: { emoji },
  }: Message<SubmitEmojiAnswerMessage>) {
    return this.currentGameSvc().submitResponseEmoji(emoji);
  }

  private submitEmojiVotes({
    payload: { playerIdVotes },
  }: Message<SubmitEmojiVotesMessage>) {
    return this.currentGameSvc().submitEmojiVotes(playerIdVotes);
  }
}
