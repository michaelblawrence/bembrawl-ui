import { useEffect, useState } from "react";
import { PageState, Messages, DefaultMessages } from "../enums/PageState";
import { HostClientService } from "../HostClientService";
import { PlayerState } from "../features/PageProps";
import { MessagesMapper } from "./messages/MessagesMapper";

interface ServerPageFSMOptions {
  disableConnection?: boolean;
}

export function useServerPageFSM(
  initialPage: PageState,
  initialState: PlayerState,
  options?: ServerPageFSMOptions | null
): [PageState, PlayerState, Messages] {
  const [page, setPage] = useState(initialPage);
  const [state, setState] = useState<PlayerState>(initialState);
  const [svc, setSvc] = useState<HostClientService | null>(null);
  const [useConnection] = useState(!options?.disableConnection);

  useEffect(() => {
    const hostClientService = new HostClientService(setState, setPage);
    setSvc(hostClientService);
    if (useConnection) startHostClientService(hostClientService);

    return () => hostClientService.dispose();
  }, [setState, useConnection]);

  useEffect(() => {
    if (svc) {
      svc.registerPage(setPage);
    }
  }, [setPage, svc]);

  const messages = mapServiceToMessages(svc, state);
  return [page, state, messages];
}

function mapServiceToMessages(
  svc: HostClientService | null,
  state: PlayerState
): Messages {
  if (!svc) return DefaultMessages;
  const messageMapper = new MessagesMapper(svc, state);
  return messageMapper.map();
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  await hostClientService.connect();
}
