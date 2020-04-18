import { setTimeout } from "timers";
export function asyncWait(timeoutMs: number): Promise<void> {
    return new Promise((ok, err) => {
        let handle: any = setTimeout(() => {
            ok();
            clearTimeout(handle);
            handle = null;
        }, timeoutMs);
    });
}
