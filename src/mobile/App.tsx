import React, { useState } from "react";
import "./App.css";
import { JoinPage } from "./features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { PageState } from "./enums/PageState";
import { useFullScreen } from "../core/effects/useFullScreen";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialPlayerState } from "./features/PageProps";

function App() {
  const [page, state, setMessage] = useServerPageFSM(PageState.JoinRoom, InitialPlayerState);
  useFullScreen(page);
  return (
    <div className="Window">
      {page === PageState.JoinRoom && (
        <JoinPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.WaitingRoom && (
        <WaitingRoomPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.PlayersAnswer && (
        <PlayersAnswerPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.PlayersAnswerReview && (
        <PlayersAnswerReviewPage setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default App;
