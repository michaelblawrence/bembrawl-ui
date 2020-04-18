import { useEffect } from "react";
import { PageState } from "../enums/PageState";
export function useFullScreen(page: PageState) {
  useEffect(() => {
    window.scrollTo(0, 1);
    return () => window.scrollTo(0, 1);
  }, [page]);
}
