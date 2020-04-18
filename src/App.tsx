import React, { useEffect } from "react";
import { useState } from "react";
import "./App.css";
import { PageState } from "./core/enums/PageState";
import { useFullScreen } from "./core/effects/useFullScreen";
import { JoinPage } from "./core-features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./core-features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./core-features/PlayersAnswerPage/PlayersAnswerPage";

function App() {
  const [page, setPage] = useState(PageState.JoinRoom);
  useFullScreen(page);
  useServerPageFSM(page, setPage);
  return (
    <div className="Window">
      {page === PageState.JoinRoom && <JoinPage setPage={setPage} />}
      {page === PageState.WaitingRoom && <WaitingRoomPage setPage={setPage} />}
      {page === PageState.PlayersAnswer && <PlayersAnswerPage setPage={setPage} />}
    </div>
  );
}

function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>
) {
  // TODO: interact with server here
  useEffect(() => {
    let handle: number | null = null;
    if (page === PageState.WaitingRoom) {
      const timeoutHandle: any = setTimeout(
        () => setPage(PageState.PlayersAnswer),
        1000
      );
      handle = timeoutHandle as number;
    }
    return () => {
      if (handle) {
        clearInterval(handle);
      }
    };
  }, [page, setPage]);
}

export default App;
