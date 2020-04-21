import React from "react";
import { useState } from "react";
import { PageState } from "./enums/PageState";
import "./AppTV.css";
import { Helmet } from "react-helmet";
import { QuestionsAndAnswersPage } from "./features/QuestionAndAnswersPage/QuestionsAndAnswersPage";
import { useServerPageFSM } from "./effects/useServerPageFSM";

function AppTV() {
  const [page, setPage] = useState(PageState.WaitingForUsers);
  useServerPageFSM(page, setPage);
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {page === PageState.WaitingForUsers && (
        <WaitingForUsersPage setPage={setPage} />
      )}
      {page === PageState.QuestionsAndAnswers && (
        <QuestionsAndAnswersPage setPage={setPage} />
      )}
    </div>
  );
}

export default AppTV;
