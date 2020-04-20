import React, { useState } from "react";
import "./App.css";
import { JoinPage } from "./features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { PageState } from "./enums/PageState";
import { useFullScreen } from "../core/effects/useFullScreen";
import { useServerPageFSM } from "../core/effects/useServerPageFSM";

function App() {
  const [page, setPage] = useState(PageState.JoinRoom);
  useFullScreen(page);
  const [setMessage] = useServerPageFSM(page, setPage);
  return (
    <div className="Window">
      {page === PageState.JoinRoom && (
        <JoinPage setPage={setPage} setMessage={setMessage} />
      )}
      {page === PageState.WaitingRoom && (
        <WaitingRoomPage setPage={setPage} setMessage={setMessage} />
      )}
      {page === PageState.PlayersAnswer && (
        <PlayersAnswerPage setPage={setPage} setMessage={setMessage} />
      )}
      {page === PageState.PlayersAnswerReview && (
        <PlayersAnswerReviewPage setPage={setPage} setMessage={setMessage} />
      )}
    </div>
  );
}

export default App;
