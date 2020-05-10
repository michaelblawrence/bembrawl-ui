import { PageState } from "./enums/PageState";
import {
  HostClientConnection,
  StateSetter,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import { ConnectionHealthTracker } from "../core/server/ConnectionHealthTracker";
import { PlayerState, InitialPlayerState } from "./features/PageProps";
import { HostClientStateService } from "../core/server/HostClientStateService";
import { ClientMessage, MessageTypes } from "../core/server/server.types";
import { PlayerClientRoutes } from "./HostClient";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";
import {
  ClientMessageHandler,
  MessageUpdate,
  MessageProps,
} from "./handlers/ClientMessageHandler";
import { EmojiPlayerService } from "./services/EmojiPlayerService";
import { RoomPlayerService } from "./services/RoomPlayerService";
import { GuessFirstPlayerService } from "./services/GuessFirstPlayerService";

export class PlayersClientConstants {
  public static readonly TIMEOUT_ALERT_JOINED_PLAYER_MS = 8000;
}

type MessageToProps = <T extends ClientMessage>(msg: T) => MessageProps<T>;

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly stateService: HostClientStateService<PlayerState>;
  private readonly clientMessageHandler: ClientMessageHandler;
  private readonly subscription: ClientMessageSubscription | null = null;

  private pageSetter: StateSetter<PageState>;
  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private emojiPlayerService: EmojiPlayerService | null = null;
  private roomPlayerService: RoomPlayerService | null = null;
  private guessFirstPlayerService: GuessFirstPlayerService | null = null;

  constructor(
    stateSetter: StateSetter<PlayerState>,
    pageSetter: StateSetter<PageState>
  ) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayerClientRoutes.API_PLAYER_REGISTER,
      keepAliveUrl: PlayerClientRoutes.API_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.JoinRoom),
    });
    this.stateService = new HostClientStateService<PlayerState>(
      InitialPlayerState,
      stateSetter
    );
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
    this.pageSetter = pageSetter;
    this.clientMessageHandler = new ClientMessageHandler();
  }

  public emojiSvc(): EmojiPlayerService | null {
    return this.getOrDefault(
      this.emojiPlayerService,
      (svc) => (this.emojiPlayerService = svc),
      () => this.resolveService((...a) => new EmojiPlayerService(...a))
    );
  }

  public guessFirstSvc(): GuessFirstPlayerService | null {
    return this.getOrDefault(
      this.guessFirstPlayerService,
      (svc) => (this.guessFirstPlayerService = svc),
      () => this.resolveService((...a) => new GuessFirstPlayerService(...a))
    );
  }

  public roomSvc(): RoomPlayerService | null {
    return this.getOrDefault(
      this.roomPlayerService,
      (svc) => (this.roomPlayerService = svc),
      () => this.resolveService((...a) => new RoomPlayerService(...a))
    );
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect(); // this info can change? do we need to register this with connection
  }

  private handleMessage(
    msg: ClientMessage,
    ctx: MessageToProps
  ): MessageUpdate {
    switch (msg.type) {
      case MessageTypes.ROOM_READY:
        return this.clientMessageHandler.ROOM_READY(ctx(msg));
      case MessageTypes.JOINED_PLAYER:
        return this.clientMessageHandler.JOINED_PLAYER(ctx(msg));
      case MessageTypes.EMOJI_GAME_STARTED:
        return this.clientMessageHandler.EMOJI_GAME_STARTED(ctx(msg));
      case MessageTypes.EMOJI_NEW_PROMPT:
        return this.clientMessageHandler.EMOJI_NEW_PROMPT(ctx(msg));
      case MessageTypes.EMOJI_ALL_RESPONSES:
        return this.clientMessageHandler.EMOJI_ALL_RESPONSES(ctx(msg));
      case MessageTypes.GUESS_FIRST_GAME_STARTED:
        return this.clientMessageHandler.GUESS_FIRST_GAME_STARTED(ctx(msg));
      case MessageTypes.GUESS_FIRST_MATCH_PROMPT:
        return this.clientMessageHandler.GUESS_FIRST_MATCH_PROMPT(ctx(msg));
      case MessageTypes.GUESS_FIRST_ALL_RESPONSES:
        return this.clientMessageHandler.GUESS_FIRST_ALL_RESPONSES(ctx(msg));
      default:
        return {};
    }
  }

  private onMessageReceived(msg: ClientMessage) {
    const connectionInfo = this.connectionInfo;
    if (!connectionInfo) {
      console.error("got message without connection?");
      return;
    }
    const state = this.stateService.getState();
    const ctx: MessageToProps = (msg) => ({
      connectionInfo,
      effects: {},
      msg,
      state,
    });

    let msgUpdate = this.handleMessage(msg, ctx);

    if (msgUpdate.state) this.stateService.pushState(msgUpdate.state);
    if (msgUpdate.page) this.transitionPage(msgUpdate.page);
  }

  public dispose() {
    if (this.pageStatusHandle) clearInterval(this.pageStatusHandle);
    this.pageStatusHandle = null;
    this.subscription?.unsubscribe();
    this.connection.dispose();
  }

  public registerPage(setPage: StateSetter<PageState>) {
    this.pageSetter = setPage;
  }

  private transitionPage(newPage: PageState) {
    if (this.pageSetter) {
      this.pageSetter(newPage);
    } else {
      console.warn(
        "wasn't registered to be able to change page. transition failed"
      );
    }
  }

  private getOrDefault<TSvc>(
    value: TSvc | null,
    setter: (newValue: TSvc) => void,
    factory: (
      p1: ConnectionInfo,
      p2: HostClientStateService<PlayerState>,
      p3: ConnectionHealthTracker,
      p4: (page: PageState) => void
    ) => TSvc
  ): TSvc | null {
    if (value) return value;
    const instance = this.resolveService(factory);
    if (instance) setter(instance);
    return instance;
  }

  private resolveService<TSvc>(
    factory: (
      p1: ConnectionInfo,
      p2: HostClientStateService<PlayerState>,
      p3: ConnectionHealthTracker,
      p4: (page: PageState) => void
    ) => TSvc
  ): TSvc | null {
    if (!this.connectionInfo) return null;
    return factory(
      this.connectionInfo,
      this.stateService,
      this.connectionHealthTracker,
      (page) => this.transitionPage(page)
    );
  }
}
