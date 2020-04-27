import React from "react";
import { PageState, Messages } from "./enums/PageState";
import "./AppTV.scss";
import { Helmet } from "react-helmet";
import { PlayersWaitingRoomPage } from "./features/PlayersWaitingRoomPage/PlayersWaitingRoomPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialHostState, HostState } from "./features/PageProps";
import { QuestionPage } from "./features/QuestionPage/QuestionPage";
import { AnswerPage } from "./features/AnswerPage/AnswerPage";
import { ResultsPage } from "./features/Results/ResultsPage";
import { WaitingForUsersPage } from "./features/WaitingForUsersPage/WaitingForUsersPage";

function AppTV() {
  const [page, state, setMessage] = useServerPageFSM(
    PageState.WaitingForUsers,
    InitialHostState
  );
  return (
    <div className="Window-AppTv">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Bembrawl TV</title>
      </Helmet>
      <AppPage page={page} setMessage={setMessage} state={state} />
    </div>
  );
}

function AppPage(props: {
  page: PageState;
  state: HostState;
  setMessage: Messages;
}) {
  const { page, state, setMessage } = props;

  switch (page) {
    case PageState.WaitingForUsers:
      return <WaitingForUsersPage setMessage={setMessage} state={state} />;

    case PageState.PlayersWaitingRoom:
      return <PlayersWaitingRoomPage setMessage={setMessage} state={state} />;

    case PageState.Question:
      return <QuestionPage setMessage={setMessage} state={state} />;

    case PageState.Answers:
      return <AnswerPage setMessage={setMessage} state={state} />;

    case PageState.Results:
      return <ResultsPage setMessage={setMessage} state={state} />;

    default:
      return null;
  }
}

export default AppTV;
