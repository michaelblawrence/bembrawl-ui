import { PageState } from "../enums/PageState";
import { ConnectionHealthTracker } from "../../core/server/ConnectionHealthTracker";
import { PlayerState } from "../features/PageProps";
import { HostClientStateService } from "../../core/server/HostClientStateService";
import { PlayerHostClient } from "../HostClient";
import { ConnectionInfo } from "../../core/configs/HostConnectionConfig";

export class RoomPlayerService {
  private readonly client: PlayerHostClient = new PlayerHostClient();

  constructor(
    private readonly connectionInfo: ConnectionInfo,
    private readonly stateService: HostClientStateService<PlayerState>,
    private readonly connectionHealthTracker: ConnectionHealthTracker,
    private readonly transitionPage: (page: PageState) => void
  ) {}

  public async joinRoom(roomId: string): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.transitionPage(PageState.WaitingRoom);
    this.connectionHealthTracker.addConnectionAttempts();

    try {
      const info = this.connectionInfo;
      const joinResult = await this.client.joinRoom(roomId, info);
      if (!joinResult.success) {
        this.transitionPage(PageState.JoinRoom);
        return false;
      }

      const state = this.stateService.getState();
      state.PlayerInfo.isMaster = joinResult.isMaster;
      state.RoomInfo.isOpen = joinResult.isOpen;
      if (joinResult.playerIdx != null) {
        state.PlayerInfo.playerId = joinResult.playerIdx + 1;
      } else {
        state.PlayerInfo.playerId = -1;
      }
      state.PlayerInfo.playerName =
        joinResult.playerName || "Player " + state.PlayerInfo.playerId;
      state.RoomInfo.roomId = roomId;
      this.stateService.pushState(state);
    } catch (ex) {
      return false;
    }
    return true;
  }

  public async closeRoom(): Promise<boolean> {
    if (!this.connectionInfo) return false;
    this.connectionHealthTracker.addConnectionAttempts();
    try {
      const state = this.stateService.getState();
      const roomId = state.RoomInfo.roomId;
      if (!roomId) return false;

      const info = this.connectionInfo;
      const success = await this.client.completeRoom(roomId, info);
      if (!success) {
        this.transitionPage(PageState.WaitingRoom);
        return false;
      }

      state.RoomInfo.isOpen = false;
      state.RoomInfo.isJoining = true;
      this.stateService.pushState(state);
    } catch (ex) {
      return false;
    }
    return true;
  }

  public async changePlayerName(playerName: string) {
    if (!this.connectionInfo) return;

    const info = this.connectionInfo;
    await this.client.changePlayerName(playerName, info);

    const state = this.stateService.getState();
    state.PlayerInfo.playerName = playerName;
    this.stateService.pushState(state);
  }
}
