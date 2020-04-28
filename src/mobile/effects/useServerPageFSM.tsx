import { useEffect, useState } from "react";
import { PageState, Messages, DefaultMessages } from "../enums/PageState";
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

function mapServiceToMessages(svc: HostClientService | null): Messages {
  if (!svc) return DefaultMessages;
  return {
    JoinRoom: ({ payload }) => svc.joinRoom(payload.roomId),
    CloseRoom: () => svc.closeRoom(),
    ChangePlayerName: ({ payload }) => svc.changePlayerName(payload.playerName),
    SubmitNewPrompt: ({ payload }) =>
      svc.submitNewPrompt(payload.promptResponse, payload.promptSubject),
    SubmitPromptMatch: ({ payload }) =>
      svc.submitPromptMatch(
        payload.promptAnswer,
        payload.promptEmoji,
        payload.promptSubject
      ),
    SubmitEmojiAnswer: ({ payload }) => svc.submitResponseEmoji(payload.emoji),
    submitEmojiVotes: ({ payload }) =>
      svc.submitEmojiVotes(payload.playerIdVotes),
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  await hostClientService.connect();
}
