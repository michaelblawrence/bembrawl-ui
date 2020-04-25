import React, { useEffect, useState } from "react";
import { Messages } from "../enums/PageState";
import { HostClientService } from "../HostClientService";
import { PageState } from "../enums/PageState";
import { HostState } from "../features/PageProps";

export function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>,
  setState: React.Dispatch<React.SetStateAction<HostState>>
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
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  // await hostClientService.connect();
}
