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

  const splitUrl = href.toLowerCase().split("/");
  const lastPath = splitUrl[splitUrl.length - 1];
  const match = hostPageIdentifiers.find(ignoreCaseCompare(lastPath));
  console.log(hostPageIdentifiers, lastPath)
  if (!match) {
    const idx = splitUrl.indexOf('dev');
    if (idx < 0) return;
    document.location.replace(splitUrl.slice(0, idx).join("/"));
  }

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
