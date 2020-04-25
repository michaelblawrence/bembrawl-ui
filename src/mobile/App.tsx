import React from "react";
import "./App.css";
import { JoinPage } from "./features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { SetPromptPage } from "./features/SetPromptPage/SetPromptPage";
import { PageState, Messages } from "./enums/PageState";
import { useFullScreen } from "../core/effects/useFullScreen";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialPlayerState, PlayerState } from "./features/PageProps";

const testingPage = document.location.pathname.endsWith("/test")
  ? PageState.PlayersAnswerReview
  : null;

function App() {
  const [page, state, setMessage] = useServerPageFSM(
    testingPage || PageState.JoinRoom,
    InitialPlayerState
  );
  useFullScreen(page);
  return (
    <div className="Window">
      <AppPage page={page} setMessage={setMessage} state={state} />
    </div>
  );
}

function AppPage(props: {
  page: PageState;
  state: PlayerState;
  setMessage: Messages;
}) {
  const { page, state, setMessage } = props;

  switch (page) {
    case PageState.JoinRoom:
      return <JoinPage setMessage={setMessage} state={state} />;

    case PageState.WaitingRoom:
      return <WaitingRoomPage setMessage={setMessage} state={state} />;

    case PageState.SetPrompt:
      return <SetPromptPage setMessage={setMessage} state={state} />;

    case PageState.PlayersAnswer:
      return <PlayersAnswerPage setMessage={setMessage} state={state} />;

    case PageState.PlayersAnswerReview:
      return <PlayersAnswerReviewPage setMessage={setMessage} state={state} />;

    default:
      return null;
  }
}

export default App;
