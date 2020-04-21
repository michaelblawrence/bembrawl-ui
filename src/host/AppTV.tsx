import React from "react";
import { useState } from "react";
import { PageState } from "./enums/PageState";
import "./AppTV.css";
import { WaitingForUsersPage } from "./features/WaitingForUsersPAge/WaitingForUsersPage";
import { Helmet } from "react-helmet";
import { QuestionsAndAnswersPage } from "./features/QuestionAndAnswersPage/QuestionsAndAnswersPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { HostState, InitialHostState } from "./features/PageProps";

function AppTV() {
  const [page, setPage] = useState(PageState.WaitingForUsers);
  const [state, setState] = useState<HostState>(InitialHostState);
  const [setMessage] = useServerPageFSM(page, setPage, setState);
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {page === PageState.WaitingForUsers && (
        <WaitingForUsersPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
      {page === PageState.QuestionsAndAnswers && (
        <QuestionsAndAnswersPage setPage={setPage} setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default AppTV;
