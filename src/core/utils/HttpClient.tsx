import { PlayersClientConstants } from "../../HostClientService";

export class HttpClient {
  public static async postJson<TReq, TResp>(
    route: string,
    data: TReq
  ): Promise<TResp> {
    const res = await fetch(PlayersClientConstants.URL_API_ROOT + route, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
    });
    return await res.json();
  }

  public static async getJson<TResp>(route: string): Promise<TResp> {
    const res = await fetch(PlayersClientConstants.URL_API_ROOT + route, {
      headers: {
        accept: "application/json",
      },
      method: "GET",
      mode: "no-cors",
    });
    return await res.json();
  }
}
