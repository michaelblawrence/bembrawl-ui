import React from "react";
import { PageState } from "./enums/PageState";
import "./AppTV.css";
import { Helmet } from "react-helmet";
import { PlayersWaitingRoomPage } from "./features/PlayersWaitingRoomPage/PlayersWaitingRoomPage";
// import { WaitingForUsersPage } from "./features/WaitingForUsersPAge/WaitingForUsersPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialHostState } from "./features/PageProps";
import { QuestionPage } from "./features/QuestionPage/QuestionPage";
import { AnswerPage } from "./features/AnswerPage/AnswerPage";
import { ResultsPage } from "./features/Results/ResultsPage";

function AppTV() {
  const [page, state, setMessage] = useServerPageFSM(
    PageState.PlayersWaitingRoom,
    InitialHostState
  );
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {/* {page === PageState.WaitingForUsers && (
        <WaitingForUsersPage setMessage={setMessage} state={state} />
      )} */}
      {page === PageState.PlayersWaitingRoom && (
        <PlayersWaitingRoomPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.Question && (
        <QuestionPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.Answers && (
        <AnswerPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.Results && (
        <ResultsPage setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default AppTV;
