export class HostClientStateService<TState> {
  private stateSetter: React.Dispatch<React.SetStateAction<TState>>;
  private playerState: TState;

  constructor(
    initialState: TState,
    stateSetter: React.Dispatch<React.SetStateAction<TState>>,
  ) {
    this.playerState = initialState;
    this.stateSetter = stateSetter;
  }

  public pushState(state: TState) {
    this.playerState = state;
    this.stateSetter(this.cloneState(state));
  }

  public getState(): TState {
    return JSON.parse(JSON.stringify(this.playerState));
  }

  private cloneState(state: TState) {
    return JSON.parse(JSON.stringify(state));
  }
}