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
    const hostClientService = new HostClientService(setState, setPage);
    setSvc(hostClientService);
    startHostClientService(hostClientService);

    return () => hostClientService.dispose();
  }, [setState]);

  useEffect(() => {
    if (svc) {
      svc.registerPage(setPage);
    }
  }, [setPage, svc]);

  return [page, state, mapServiceToMessages(svc)];
}

function mapServiceToMessages(svc: HostClientService | null): Messages {
  if (!svc) return DefaultMessages;
  const emojiSvc = () => svc.emojiSvc();
  const roomSvc = () => svc.roomSvc();
  const guessFirstSvc = () => svc.guessFirstSvc();
  return {
    JoinRoom: ({ payload }) => roomSvc()?.joinRoom(payload.roomId),
    CloseRoom: () => roomSvc()?.closeRoom(),
    ChangePlayerName: ({ payload }) =>
      roomSvc()?.changePlayerName(payload.playerName),
    SubmitNewPrompt: ({ payload }) =>
      emojiSvc()?.submitNewPrompt(
        payload.promptResponse,
        payload.promptSubject
      ),
    SubmitPromptMatch: ({ payload }) =>
      guessFirstSvc()?.submitPromptMatch(
        payload.promptAnswer,
        payload.promptEmoji,
        payload.promptSubject
      ),
    SubmitEmojiAnswer: ({ payload }) =>
      emojiSvc()?.submitResponseEmoji(payload.emoji),
    SubmitEmojiVotes: ({ payload }) =>
      emojiSvc()?.submitEmojiVotes(payload.playerIdVotes),
  };
}

async function startHostClientService(hostClientService: HostClientService) {
  if (!hostClientService) return;
  await hostClientService.connect();
}
