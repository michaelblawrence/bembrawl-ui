import React, { useState } from "react";
import "./App.css";
import { JoinPage } from "./features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { PageState } from "./enums/PageState";
import { useFullScreen } from "../core/effects/useFullScreen";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { PlayerState, InitialPlayerState } from "./features/PageProps";

function App() {
  const [page, setPage] = useState(PageState.JoinRoom);
  const [state, setState] = useState<PlayerState>(InitialPlayerState);
  useFullScreen(page);
  const [setMessage] = useServerPageFSM(page, setPage, setState);
  return (
    <div className="Window">
      {page === PageState.JoinRoom && (
        <JoinPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
      {page === PageState.WaitingRoom && (
        <WaitingRoomPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
      {page === PageState.PlayersAnswer && (
        <PlayersAnswerPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
      {page === PageState.PlayersAnswerReview && (
        <PlayersAnswerReviewPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default App;
