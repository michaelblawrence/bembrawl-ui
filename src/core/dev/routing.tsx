import { PageState as HostPageState } from "../../host/enums/PageState";
import { PageState as MobilePageState } from "../../mobile/enums/PageState";

export function isDev() {
  const href = document.location.href;
  const trimmed = href.endsWith("/")
    ? href.substring(0, href.length - 1)
    : href;
  return trimmed.includes("/dev/");
}

// TODO: merge two functions below

export function setHostPage() {
  {
    let page = HostPageState.WaitingForUsers;
    const href = document.location.href;
    let splitUrl = href.split("/");
    const lastPath = splitUrl[splitUrl.length - 1];
    const re = RegExp(lastPath, "g");
    Object.values(HostPageState).map((item) => {
      if (re.exec(item.toLowerCase())) {
        page = HostPageState[item];
        return page;
      }
    });
    return page;
  }
}

export function setMobilePage() {
  {
    let page = MobilePageState.JoinRoom;
    const href = document.location.href;
    let splitUrl = href.split("/");
    const lastPath = splitUrl[splitUrl.length - 1];
    const re = RegExp(lastPath, "g");
    Object.values(MobilePageState).map((item) => {
      if (re.exec(item.toLowerCase())) {
        page = MobilePageState[item];
        return page;
      }
    });
    return page;
  }
}
