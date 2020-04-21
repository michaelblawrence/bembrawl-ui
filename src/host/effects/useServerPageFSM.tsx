import React, { useEffect, useState } from "react";
import { Messages } from "../enums/PageState";
import { HostClientService } from "../HostClientService";
import { PageState } from "../enums/PageState";

export function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>
): [Messages] {
  const [svc, setSvc] = useState<HostClientService | null>(null);
  useEffect(() => initServices(page, setPage, svc, setSvc), [
    page,
    setPage,
    svc,
    setSvc,
  ]);
  return [mapServiceToMessages(svc)];
}

const defaultMessages: Messages = {
  JoinRoom: () => {},
};

function mapServiceToMessages(svc: HostClientService | null): Messages {
  if (!svc) return defaultMessages;
  return {};
}

function initServices(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>,
  svc: HostClientService | null,
  setSvc: React.Dispatch<React.SetStateAction<HostClientService | null>>
) {
  if (svc) {
    return () => {
      svc.dispose();
    };
  }

  const hostClientService = new HostClientService();
  hostClientService.registerPage(page, setPage);
  startHostClientService(hostClientService);
  setSvc(hostClientService);

  return () => {
    hostClientService.dispose();
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) {
    return;
  }
  await hostClientService.connect();
}
