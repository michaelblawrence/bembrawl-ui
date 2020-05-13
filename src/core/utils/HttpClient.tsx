class HttpClientConfig {
  public static readonly URL_API_ROOT =
    process.env.REACT_APP_API_URL || "http://192.168.1.66:4000/api/v2";
}

export class HttpClient {
  public static async postJson<TReq, TResp>(
    route: string,
    data: TReq,
    token: string | null = null
  ): Promise<TResp> {
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
    if (token) headers["authorization"] = `Bearer ${token}`;
    const res = await fetch(HttpClientConfig.URL_API_ROOT + route, {
      headers,
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
    });
    return await HttpClient.extractOkResponse(res);
  }

  public static async getJson<TResp>(
    route: string,
    token: string | null = null
  ): Promise<TResp> {
    const headers: { [key: string]: string } = {
      accept: "application/json",
    };
    if (token) headers["authorization"] = `Bearer ${token}`;
    const res = await fetch(HttpClientConfig.URL_API_ROOT + route, {
      headers: headers,
      method: "GET",
      mode: "no-cors",
    });
    return await HttpClient.extractOkResponse(res);
  }

  private static async extractOkResponse(res: Response) {
    if (!res.ok) {
      let msg: string | undefined;
      try {
        msg = await res.text();
      }
      catch {
        /* swallow error */
      }
      throw new Error(msg);
    }
    return await res.json();
  }
}
