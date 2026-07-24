const API_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      ...options.headers,
    };

    // Don't set Content-Type for FormData (browser sets it automatically with boundary)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "خطای سرور");
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
export default api;
