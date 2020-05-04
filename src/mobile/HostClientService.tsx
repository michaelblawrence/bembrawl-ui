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
  private emojiMobileService: EmojiPlayerService | null = null;
  private roomMobileService: RoomPlayerService | null = null;

  constructor(
    stateSetter: StateSetter<PlayerState>,
    pageSetter: StateSetter<PageState>
  ) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.connection = new HostClientConnection({
      registerUrl: PlayerClientRoutes.URL_API_ROUTE_PLAYER_REGISTER,
      keepAliveUrl: PlayerClientRoutes.URL_API_ROUTE_KEEP_ALIVE,
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

  public async connect() {
    this.connectionInfo = await this.connection.connect(); // this info can change? do we need to register this with connection
  }

  public onMessageReceived(msg: ClientMessage) {
    const connectionInfo = this.connectionInfo;
    if (!connectionInfo) {
      console.error("got message without connection?");
      return;
    }
    const state = this.stateService.getState();
    const ctx: MessageToProps = (msg) => ({ connectionInfo, msg, state });

    let msgUpdate = this.handleMessage(msg, ctx);

    if (msgUpdate.state) this.stateService.pushState(msgUpdate.state);
    if (msgUpdate.page) this.transitionPage(msgUpdate.page);
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
      default:
        return {};
    }
  }

  public dispose() {
    if (this.pageStatusHandle) {
      clearInterval(this.pageStatusHandle);
      this.pageStatusHandle = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.connection.dispose();
  }

  public registerPage(page: PageState, setPage: StateSetter<PageState>) {
    this.pageSetter = setPage;
  }

  public emojiSvc(): EmojiPlayerService | null {
    const svc = () =>
      this.resolveService((...a) => new EmojiPlayerService(...a));
    return (this.emojiMobileService = this.emojiMobileService || svc());
  }

  public roomSvc(): RoomPlayerService | null {
    const svc = () =>
      this.resolveService((...a) => new RoomPlayerService(...a));
    return (this.roomMobileService = this.roomMobileService || svc());
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
      page => this.transitionPage(page)
    );
  }
}
