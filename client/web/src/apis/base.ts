import { API_URL } from "@/constants/config";

export const baseApi = {
  token: "",
  getAuthHeader(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  },
  async get<D = any>(path: string, params?: any) {
    const url = new URL(`${API_URL}${path}`);
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }

    const res = await fetch(url, {
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.detail);
    }

    if (res.headers.get("Content-Type")?.includes("application/json")) {
      return res.json() as Promise<D>;
    }
    return res.text() as Promise<D>;
  },
  async post<D = any>(path: string, data: any) {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
      credentials: "same-origin",
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.msg);
    }

    if (res.headers.get("Content-Type")?.includes("application/json")) {
      return res.json() as Promise<D>;
    }
    return res.text() as Promise<D>;
  },
};
