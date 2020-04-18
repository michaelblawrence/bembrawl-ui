import React, { useEffect } from "react";
import { useState } from "react";
import { PageState } from "./core/enums/PageState";
import "./AppTV.css";
import { WaitingForUsers } from "./core-features/WaitingForUsers/WaitingForUsers";

function AppTV() {
  const [page, setPage] = useState(PageState.WaitingForUsers);
  useServerPageFSM(page, setPage);
  return (
    <div className="Window">
      {page === PageState.WaitingForUsers && <WaitingForUsers setPage={setPage} />}
      {/* {page === PageState.QuestionAndAnswers && <WaitingRoomPage setPage={setPage} />}
      {page === PageState.PlayersAnswer && <PlayersAnswerPage setPage={setPage} />}
      {page === PageState.PlayersAnswerReview && <PlayersAnswerReviewPage setPage={setPage} />} */}
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
    // if (page === PageState.WaitingRoom) {
    //   const timeoutHandle: any = setTimeout(
    //     () => setPage(PageState.PlayersAnswer),
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
