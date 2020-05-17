import React from "react";
import "./App.scss";
import { JoinPage } from "./features/JoinPage/JoinPage";
import { WaitingRoomPage } from "./features/WaitingRoomPage/WaitingRoomPage";
import { PlayersAnswerPage } from "./features/PlayersAnswerPage/PlayersAnswerPage";
import { PlayersAnswerReviewPage } from "./features/PlayersAnswerReviewPage/PlayersAnswerReviewPage";
import { PlayersGuessingPage } from "./features/PlayersGuessingPage/PlayersGuessingPage";
import { SetPromptPage } from "./features/SetPromptPage/SetPromptPage";
import { PageState, Messages } from "./enums/PageState";
import { useFullScreen } from "../core/effects/useFullScreen";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialPlayerState, PlayerState } from "./features/PageProps";
import { isDev, setMobilePage } from "../core/dev/routing";

const isTestingPage = document.location.pathname.endsWith("/test");
const testingPage = isTestingPage ? PageState.PlayersGuessingPage : null;

function App() {
  const [page, state, setMessage] = useServerPageFSM(
    testingPage || PageState.JoinRoom,
    InitialPlayerState,
    { disableConnection: isTestingPage }
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
  const { state, setMessage, page: propsPage } = props;
  const page = isDev() ? setMobilePage() || propsPage : propsPage;

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

    case PageState.PlayersGuessingPage:
      return <PlayersGuessingPage setMessage={setMessage} state={state} />;

    default:
      return null;
  }
}

export default App;
