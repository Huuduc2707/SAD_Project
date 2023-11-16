export const baseApi = {
  token: "",
  getAuthHeader(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  },
  async request<D = any>(path: string | URL, options: RequestInit) {
    const res = await fetch(path, {
      ...options,
      headers: {
        ...options.headers,
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
  async get<D = any>(path: string, params?: any) {
    const url = new URL(`${path}`, window.location.origin);
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }
    return this.request<D>(url, {
      method: "GET",
    });
  },
  async post<D = any>(path: string, data: any) {
    return this.request<D>(`${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  async put<D = any>(path: string, data: any) {
    return this.request<D>(`${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  async delete<D = any>(path: string) {
    return this.request<D>(`${path}`, {
      method: "DELETE",
    });
  },
};
