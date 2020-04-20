import React, { useEffect } from "react";
import { useState } from "react";
import { PageState } from "./core/enums/PageState";
import "./AppTV.css";
import { WaitingForUsersPage } from "./core-features/WaitingForUsersPAge/WaitingForUsersPage";
import { Helmet } from "react-helmet";
import {QuestionsAndAnswersPage} from './core-features/QuestionAndAnswersPage/QuestionsAndAnswersPage';

function AppTV() {
  const [page, setPage] = useState(PageState.WaitingForUsers);
  useServerPageFSM(page, setPage);
  return (
    <div className="Window">
      <Helmet>
        <meta charSet="utf-8" />
        <title>BembrawlTV</title>
      </Helmet>
      {page === PageState.WaitingForUsers && <WaitingForUsersPage setPage={setPage} />}
      {page === PageState.QuestionsAndAnswers && <QuestionsAndAnswersPage setPage={setPage} />}
    </div>
  );
}


function useServerPageFSM(
  page: PageState,
  setPage: React.Dispatch<React.SetStateAction<PageState>>
) {
  // TODO: interact with server here
  useEffect(() => {
    let handle: number | null = null;
    // if (page === PageState.WaitingForUsers) {
    //   const timeoutHandle: any = setTimeout(
    //     () => setPage(PageState.WaitingForUsers),
    //     1000
    //   );
    //   handle = timeoutHandle as number;
    // }
    return () => {
      if (handle) {
        clearInterval(handle);
      }
    };
  }, [page, setPage]);
}


export default AppTV;
