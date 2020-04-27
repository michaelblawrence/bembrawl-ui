import { HostClientConstants } from "./HostClientConnection";

export class ConnectionHealthTracker {
  private connectAttempts: number = 0;
  public addSuccessfulAttempt() {
    this.connectAttempts = 0;
  }
  public addConnectionAttempts() {
    this.connectAttempts++;
  }
  public hasExceededAttempts() {
    return this.connectAttempts >= HostClientConstants.MAX_API_ATTEMPTS;
  }
}
