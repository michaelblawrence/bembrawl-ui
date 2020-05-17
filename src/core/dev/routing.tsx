import { PageState as HostPageState } from "../../host/enums/PageState";
import { PageState as MobilePageState } from "../../mobile/enums/PageState";

export function isDev() {
  const href = document.location.href;
  const trimmed = href.endsWith("/")
    ? href.substring(0, href.length - 1)
    : href;
  return trimmed.includes("/dev/");
}

export function setPageFromRoutePath(pageState: any) {
  const hostPageIdentifiers = Object.values(pageState) as string[];
  const href = document.location.href;

  const splitUrl = href.split("/");
  const lastPath = splitUrl[splitUrl.length - 1];
  const match = hostPageIdentifiers.find(ignoreCaseCompare(lastPath));

  return match;
}

export function setHostPage(): HostPageState | undefined {
  return setPageFromRoutePath(HostPageState) as HostPageState | undefined;
}

export function setMobilePage(): MobilePageState | undefined {
  return setPageFromRoutePath(MobilePageState) as MobilePageState | undefined;
}

function ignoreCaseCompare(matchText: string): (testMatch: string) => boolean {
  return (ident) => matchText.toLowerCase().includes(ident.toLowerCase());
}