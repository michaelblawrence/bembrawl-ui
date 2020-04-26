import { useEffect, useState } from "react";
import { PageState, Messages } from "../enums/PageState";
import { HostClientService } from "../HostClientService";
import { PlayerState } from "../features/PageProps";

export function useServerPageFSM(
  initialPage: PageState,
  initialState: PlayerState
): [PageState, PlayerState, Messages] {
  const [page, setPage] = useState(initialPage);
  const [state, setState] = useState<PlayerState>(initialState);
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

  return [page, state, mapServiceToMessages(svc)];
}

const defaultMessages: Messages = {
  JoinRoom: () => {},
  CloseRoom: () => {},
  ChangePlayerName: () => {},
  SubmitNewPrompt: () => {},
  SubmitEmojiAnswer: () => {},
  submitEmojiVotes: () => {},
};

function mapServiceToMessages(svc: HostClientService | null): Messages {
  if (!svc) return defaultMessages;
  return {
    JoinRoom: (msg) => svc.joinRoom(msg.payload.roomId),
    CloseRoom: () => svc.closeRoom(),
    ChangePlayerName: (msg) => svc.changePlayerName(msg.payload.playerName),
    SubmitNewPrompt: (msg) => svc.submitNewPrompt(msg.payload.promptResponse),
    SubmitEmojiAnswer: (msg) => svc.submitResponseEmoji(msg.payload.emoji),
    submitEmojiVotes: (msg) => svc.submitEmojiVotes(msg.payload.playerIdVotes),
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  await hostClientService.connect();
}
