import React, { useState } from "react";
import "./App.css";
import { PageState } from "./core/enums/PageState";
import { useFullScreen } from "./core/effects/useFullScreen";
import { JoinPage } from "./core-features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./core-features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./core-features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./core-features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { useServerPageFSM } from "./core/effects/useServerPageFSM";

function App() {
  const [page, setPage] = useState(PageState.PlayersAnswerReview);
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
