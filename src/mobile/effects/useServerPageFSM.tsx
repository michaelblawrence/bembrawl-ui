import React, { useEffect, useState } from "react";
import { PageState, Messages } from "../enums/PageState";
import { HostClientService } from "../HostClientService";
import { PlayerState } from "../features/PageProps";

export function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>,
  setState: React.Dispatch<React.SetStateAction<PlayerState>>
): [Messages] {
  const [svc, setSvc] = useState<HostClientService | null>(null);

  useEffect(() => {
    const hostClientService = new HostClientService(setState);
    setSvc(hostClientService);
    startHostClientService(hostClientService);

    return () => hostClientService.dispose();
  }, [setState]);

  useEffect(() => {
    if (svc) {
      svc.registerPage(page, setPage);
    }
  }, [page, setPage, svc]);

  return [mapServiceToMessages(svc)];
}

const defaultMessages: Messages = {
  JoinRoom: () => {},
  CloseRoom: () => {},
};

function mapServiceToMessages(svc: HostClientService | null): Messages {
  if (!svc) return defaultMessages;
  return {
    JoinRoom: (msg) => svc.joinRoom(msg.payload.roomId),
    CloseRoom: () => svc.closeRoom(),
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  await hostClientService.connect();
}
