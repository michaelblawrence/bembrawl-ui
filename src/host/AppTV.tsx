import React from "react";
import { useState } from "react";
import { PageState } from "./enums/PageState";
import "./AppTV.css";
import { Helmet } from "react-helmet";
import { WaitingForUsersPage } from "./features/WaitingForUsersPage/WaitingForUsersPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";
import { HostState, InitialHostState } from "./features/PageProps";
import { QuestionPage } from "./features/QuestionPage/QuestionPage";

function AppTV() {
  const [page, setPage] = useState(PageState.QuestionsAndAnswers);
  const [state, setState] = useState<HostState>(InitialHostState);
  const [setMessage] = useServerPageFSM(page, setPage, setState);
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {page === PageState.WaitingForUsers && (
        <WaitingForUsersPage setMessage={setMessage} state={state} />
      )}
      {page === PageState.QuestionsAndAnswers && (
        <QuestionPage setMessage={setMessage} state={state} />
      )}
    </div>
  );
}

export default AppTV;
