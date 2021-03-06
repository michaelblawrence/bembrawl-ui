import { PageState } from "../enums/PageState";
import { ConnectionHealthTracker } from "../../core/server/ConnectionHealthTracker";
import { PlayerState } from "../features/PageProps";
import { HostClientStateService } from "../../core/server/HostClientStateService";
import { EmojiPlayerClient } from "../HostClient";
import { ConnectionInfo } from "../../core/configs/HostConnectionConfig";

export class EmojiPlayerService {
  private readonly client: EmojiPlayerClient = new EmojiPlayerClient();

  constructor(
    private readonly connectionInfo: ConnectionInfo,
    private readonly stateService: HostClientStateService<PlayerState>,
    private readonly connectionHealthTracker: ConnectionHealthTracker,
    private readonly transitionPage: (page: PageState) => void
  ) {}

  public async submitNewPrompt(promptResponse: string, promptSubject: string) {
    if (!this.connectionInfo) return;

    this.transitionPage(PageState.WaitingRoom);
    const info = this.connectionInfo;
    await this.client.newPrompt(promptResponse, promptSubject, info);
  }

  public async submitResponseEmoji(emoji: string[]) {
    if (!this.connectionInfo) return;

    const info = this.connectionInfo;
    await this.client.newEmojiResponse(emoji, info);
    this.transitionPage(PageState.WaitingRoom);
  }

  public async submitEmojiVotes(playerIdVotes: [string, number][]) {
    if (!this.connectionInfo) return;
    this.transitionPage(PageState.WaitingRoom);

    const info = this.connectionInfo;
    const votes = playerIdVotes.flatMap(([playerId, count]) =>
      new Array(count).fill(playerId)
    );
    await this.client.emojiVotesResponse(votes, info);
  }
}
