export class HostClientStateService<TState> {
  private readonly localStorageKey: string | null = null;
  private readonly persistedStore: TState | null = null;

  private stateSetter: React.Dispatch<React.SetStateAction<TState>>;
  private store: TState;
  private deferHandle: number | null = null;

  constructor(
    initialState: TState,
    stateSetter: React.Dispatch<React.SetStateAction<TState>>,
    persistanceKey: string | null = null
  ) {
    this.store = initialState;
    this.stateSetter = stateSetter;
    this.localStorageKey = persistanceKey ? `bbState_${persistanceKey}` : null;

    if (this.localStorageKey) {
      this.persistedStore = this.extractStateFromLocalStorage(
        this.localStorageKey
      );
    }
    console.info("PersistedState", this.persistedStore);
  }

  public pushState(state: TState) {
    this.store = state;
    this.stateSetter(this.cloneState(state));

    if (this.localStorageKey !== null)
      this.deferredPersistState(this.localStorageKey, state);
  }

  public getState(): TState {
    return this.cloneState(this.store);
  }

  public getLastState(): TState | null {
    return this.persistedStore && this.cloneState(this.persistedStore);
  }

  private cloneState(state: TState): TState {
    return JSON.parse(JSON.stringify(state));
  }

  private deferredPersistState(persistanceKey: string, state: TState) {
    const serialized = this.serializeState(state);
    this.executeDeferred(() =>
      this.pushStateToLocalStorage(persistanceKey, serialized)
    );
  }

  private executeDeferred(fn: () => void) {
    if (this.deferHandle) {
      clearTimeout(this.deferHandle);
    }
    this.deferHandle = setTimeout(() => {
      fn();
      this.deferHandle = null;
    }, 0) as any;
  }

  private pushStateToLocalStorage(
    persistanceKey: string,
    serializedState: string
  ) {
    try {
      window.localStorage.setItem(persistanceKey, serializedState);
    } catch (ex) {
      console.warn("Failed to persist state", ex);
    }
  }

  private extractStateFromLocalStorage(persistanceKey: string): TState | null {
    try {
      const serializedState = window.localStorage.getItem(persistanceKey);
      if (!serializedState) return null;
      return this.deserializeState(serializedState);
    } catch (ex) {
      console.warn("Failed to persist state", ex);
      return null;
    }
  }

  private serializeState(state: TState): string {
    const forSerialization: PersistedStateV1<TState> = {
      type: "bb_state",
      version: "v1",
      when: Date.now(),
      payload: state,
    };
    return JSON.stringify(forSerialization);
  }

  private deserializeState(
    serializedState: string,
    version: PersistedStateVersion = "v1"
  ): TState | null {
    const obj: PersistedStateV1<TState> = JSON.parse(serializedState);
    if (obj?.type !== "bb_state" || obj?.version !== version) return null;
    return obj.payload;
  }
}

type PersistedStateVersion = "v1" | "vBeta";

interface PersistedStateV1<TState> extends PersistedState<"v1"> {
  when: number;
  payload: TState;
}
interface PersistedState<TVersion extends PersistedStateVersion> {
  type: "bb_state";
  version: TVersion;
}
