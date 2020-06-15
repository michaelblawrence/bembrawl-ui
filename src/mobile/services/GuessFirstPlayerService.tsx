import { PageState } from "../enums/PageState";
import { ConnectionHealthTracker } from "../../core/server/ConnectionHealthTracker";
import { PlayerState } from "../features/PageProps";
import { HostClientStateService } from "../../core/server/HostClientStateService";
import { GuessFirstPlayerClient } from "../HostClient";
import { ConnectionInfo } from "../../core/configs/HostConnectionConfig";

export class GuessFirstPlayerService {
  private readonly client: GuessFirstPlayerClient = new GuessFirstPlayerClient();

  constructor(
    private readonly connectionInfo: ConnectionInfo,
    private readonly stateService: HostClientStateService<PlayerState>,
    private readonly connectionHealthTracker: ConnectionHealthTracker,
    private readonly transitionPage: (page: PageState) => void
  ) {}

  public async submitNewPrompt(promptResponse: string, promptSubject: string) {
    if (!this.connectionInfo) return;
    const state = this.stateService.getState();

    state.EmojiGame.Question.Subject = promptSubject;
    state.EmojiGame.Question.Prompt = promptResponse;
    state.EmojiGame.GuessFirst.Question.Secret = promptResponse;

    this.stateService.pushState(state);
    this.transitionPage(PageState.PlayersAnswer);
  }

  public async submitResponseEmoji(emoji: string[]) {
    const info = this.connectionInfo;
    if (!info) return;

    const { EmojiGame } = this.stateService.getState();
    const promptAnswer = EmojiGame.Question.Prompt;
    const promptSubject = EmojiGame.Question.Subject;
    if (!promptAnswer || !promptSubject) return;

    await this.client.promptMatch(promptAnswer, emoji, promptSubject, info);
    this.transitionPage(PageState.WaitingRoom);
  }

  public async correctGuess(answerText: string) {
    const state = this.stateService.getState();
    const promptSubject = state.EmojiGame.Question.Subject;
    const info = this.connectionInfo;
    if (!info || !promptSubject) return;

    const success = await this.client.newEmojiResponse(
      answerText,
      promptSubject,
      info
    );
    if (!success) {
      state.EmojiGame.GuessFirst.notifyMessage = "Wrong answer";
      this.stateService.pushState(state);
      return;
    }
    this.transitionPage(PageState.WaitingRoom);
  }

  public async wrongGuess(answerText: string) {
    const { EmojiGame } = this.stateService.getState();
    const promptSubject = EmojiGame.Question.Subject;
    const info = this.connectionInfo;
    if (!info || !promptSubject) return;

    await this.client.wrongGuess(answerText, promptSubject, info);
  }
}
