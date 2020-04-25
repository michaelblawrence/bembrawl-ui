import React from "react";
import { PageState } from "./enums/PageState";
import "./AppTV.css";
import { Helmet } from "react-helmet";
import { QuestionsAndAnswersPage } from "./features/QuestionAndAnswersPage/QuestionsAndAnswersPage";
import { PlayersWaitingRoomPage } from "./features/PlayersWaitingRoomPage/PlayersWaitingRoomPage";
import { WaitingForUsersPage } from "./features/WaitingForUsersPAge/WaitingForUsersPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { InitialHostState } from "./features/PageProps";

function AppTV() {
  const [page, state, setMessage] = useServerPageFSM(PageState.PlayersWaitingRoom, InitialHostState);
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {page === PageState.WaitingForUsers && (
        <WaitingForUsersPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.PlayersWaitingRoom && (
        <PlayersWaitingRoomPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.QuestionsAndAnswers && (
        <QuestionsAndAnswersPage setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default AppTV;
