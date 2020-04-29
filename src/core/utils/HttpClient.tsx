class HttpClientConfig {
  public static readonly URL_API_ROOT = "http://192.168.1.66:4000/api/v2";
}

export class HttpClient {
  public static async postJson<TReq, TResp>(
    route: string,
    data: TReq
  ): Promise<TResp> {
    const res = await fetch(HttpClientConfig.URL_API_ROOT + route, {
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
    const res = await fetch(HttpClientConfig.URL_API_ROOT + route, {
      headers: {
        accept: "application/json",
      },
      method: "GET",
      mode: "no-cors",
    });
    return await res.json();
  }
}
