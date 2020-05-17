import { PageState } from "./enums/PageState";
import {
  HostClientConnection,
  StateSetter,
  ClientMessageSubscription,
} from "../core/server/HostClientConnection";
import { ConnectionHealthTracker } from "../core/server/ConnectionHealthTracker";
import { HostState, InitialHostState } from "./features/PageProps";
import { HostClientStateService } from "../core/server/HostClientStateService";
import { MessageTypes, ClientMessage } from "../core/server/server.types";
import { ConnectionInfo } from "../core/configs/HostConnectionConfig";
import { HostClient, HostClientConstants } from "./HostClient";
import {
  MessageUpdate,
  HostMessageHandler,
  MessageProps,
} from "./handlers/HostMessageHandler";
import { GameType } from "../core/enums/GameType";

type MessageToProps = <T extends ClientMessage>(msg: T) => MessageProps<T>;

export class HostClientService {
  private readonly connection: HostClientConnection;
  private readonly connectionHealthTracker: ConnectionHealthTracker;
  private readonly stateService: HostClientStateService<HostState>;
  private readonly hostMessageHandler: HostMessageHandler;
  private readonly subscription: ClientMessageSubscription;
  private readonly client: HostClient;

  private connectionInfo: ConnectionInfo | null = null;
  private pageStatusHandle: number | null = null;
  private pageSetter: StateSetter<PageState> | null = null;

  constructor(stateSetter: React.Dispatch<React.SetStateAction<HostState>>) {
    this.connectionHealthTracker = new ConnectionHealthTracker();
    this.stateService = new HostClientStateService<HostState>(
      InitialHostState,
      stateSetter,
      "host-v1"
    );
    const lastState = this.stateService.getLastState();
    this.connection = new HostClientConnection({
      registerUrl: getRegisterUrl(document.location, lastState),
      keepAliveUrl: HostClientConstants.API_ROUTE_KEEP_ALIVE,
      promptReconnect: () => this.transitionPage(PageState.WaitingForUsers),
    });
    this.subscription = this.connection.subscribe((msg) =>
      this.onMessageReceived(msg)
    );
    this.hostMessageHandler = new HostMessageHandler();
    this.client = new HostClient();
    this.manageWindowEvents("register");
  }

  public async connect() {
    this.connectionInfo = await this.connection.connect();
  }

  private handleMessage(
    msg: ClientMessage,
    ctx: MessageToProps
  ): MessageUpdate {
    switch (msg.type) {
      case MessageTypes.CONNECT_SUCCESS:
        return this.hostMessageHandler.CONNECT_SUCCESS(ctx(msg));
      case MessageTypes.PLAYER_LIST:
        return this.hostMessageHandler.PLAYER_LIST(ctx(msg));
      case MessageTypes.ROOM_READY:
        return this.hostMessageHandler.ROOM_READY(ctx(msg));
      case MessageTypes.EMOJI_GAME_STARTED:
        return this.hostMessageHandler.EMOJI_GAME_STARTED(ctx(msg));
      case MessageTypes.EMOJI_NEW_PROMPT:
        return this.hostMessageHandler.EMOJI_NEW_PROMPT(ctx(msg));
      case MessageTypes.EMOJI_ALL_RESPONSES:
        return this.hostMessageHandler.EMOJI_ALL_RESPONSES(ctx(msg));
      case MessageTypes.EMOJI_VOTING_RESULTS:
        return this.hostMessageHandler.EMOJI_VOTING_RESULTS(ctx(msg));
      case MessageTypes.GUESS_FIRST_GAME_STARTED:
        return this.hostMessageHandler.GUESS_FIRST_GAME_STARTED(ctx(msg));
      case MessageTypes.GUESS_FIRST_MATCH_PROMPT:
        return this.hostMessageHandler.GUESS_FIRST_MATCH_PROMPT(ctx(msg));
      case MessageTypes.GUESS_FIRST_WRONG_ANSWER:
        return this.hostMessageHandler.GUESS_FIRST_WRONG_ANSWER(ctx(msg));
      case MessageTypes.GUESS_FIRST_ALL_RESPONSES:
        return this.hostMessageHandler.GUESS_FIRST_ALL_RESPONSES(ctx(msg));
      case MessageTypes.GUESS_FIRST_VOTING_RESULTS:
        return this.hostMessageHandler.GUESS_FIRST_VOTING_RESULTS(ctx(msg));
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
      effects: {
        register: (type, roomId) => this.registerGame(type, roomId),
      },
      msg,
      state,
    });

    let msgUpdate = this.handleMessage(msg, ctx);

    if (msgUpdate.state) this.stateService.pushState(msgUpdate.state);
    if (msgUpdate.page) this.transitionPage(msgUpdate.page);
  }

  private async registerGame(type: GameType, roomId: number): Promise<void> {
    const info = this.connectionInfo;
    if (!info) return;

    let success = null;

    switch (type) {
      case GameType.Emoji:
        console.warn("starting GameType.Emoji");
        success = await this.client.emojiRegister(roomId, info);
        break;
      case GameType.GuessFirst:
        console.warn("starting GameType.GuessFirst");
        success = await this.client.guessFirstRegister(roomId, info);
        break;
      default:
        console.warn("no game starting GameType");
        break;
    }

    if (!success) {
      console.error("register failed");
      this.connection.reconnect();
      return this.transitionPage(PageState.WaitingForUsers);
    }
  }

  public dispose() {
    this.manageWindowEvents("unregister");
    if (this.pageStatusHandle) {
      clearInterval(this.pageStatusHandle);
      this.pageStatusHandle = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.connection.dispose();
  }

  public registerPage(
    page: PageState,
    setPage: React.Dispatch<React.SetStateAction<PageState>>
  ) {
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

  private manageWindowEvents(action: "register" | "unregister") {
    switch (action) {
      case "register":
        window.addEventListener("keydown", this.keyboardHandler.bind(this));
        break;
      case "unregister":
        window.removeEventListener("keydown", this.keyboardHandler.bind(this));
        break;
    }
  }

  private async keyboardHandler(ev: KeyboardEvent) {
    switch (ev.key) {
      case "n":
        this.connection.reconnect(HostClientConstants.API_ROUTE_HOST_REGISTER);
        return;
    }
  }
}

function getRegisterUrl(
  location: Location,
  lastState: HostState | null
): string {
  const extractUrlRoomId = (urlPath: string) => {
    const matches = /room\/(\d{4})\/?$/.exec(urlPath);
    return (matches && matches[1]) || null;
  };
  const lastRoomId = lastState?.RoomInfo.roomId;
  const roomId = extractUrlRoomId(location.pathname) || lastRoomId;
  if (roomId) {
    return (
      HostClientConstants.API_ROUTE_HOST_JOIN +
      `?createIfNone=1&roomId=${roomId}`
    );
  }
  return HostClientConstants.API_ROUTE_HOST_REGISTER;
}
