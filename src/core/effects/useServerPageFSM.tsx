import React, { useEffect } from "react";
import { PageState } from "../enums/PageState";
import { HostClientService } from "../../HostClientService";

export function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>
) {
  // TODO: interact with server here
  useEffect(() => initServices(page, setPage), [page, setPage]);
}

export function initServices(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>
) {
  const hostClientService = new HostClientService();
  hostClientService.registerPage(page, setPage);
  startHostClientService(hostClientService);
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
