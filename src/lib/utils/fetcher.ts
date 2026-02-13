// lib/fetcher.ts
"use server";
import { cookies } from "next/headers";
const BASE_URL = "http://localhost:3000/api";

type FetcherOptions = RequestInit & {
  isServer?: boolean;
};

class TokenRefreshManager {
  private refreshPromise: Promise<boolean> | null = null;

  async refresh(isServer: boolean): Promise<boolean> {
    // If refresh is already in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh(isServer);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(isServer: boolean): Promise<boolean> {
    try {
      const refreshToken = isServer
        ? (await cookies()).get("refreshToken")?.value
        : document.cookie
            .split("; ")
            .find((row) => row.startsWith("refreshToken="))
            ?.split("=")[1];

      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });

      if (!response.ok) {
        return false;
      }

      const { data } = await response.json();

      const cookiesStore = await cookies();
      cookiesStore.set("refreshToken", data.refreshToken);
      console.log(data, "cookies goes brrrr");

      // Server-side: cookies are set via Set-Cookie header in the refresh endpoint
      // Client-side: cookies are also set via Set-Cookie header automatically

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}

// Singleton instance to prevent multiple simultaneous refreshes
const tokenRefreshManager = new TokenRefreshManager();

export async function fetcher<T = any>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> {
  const { isServer = typeof window === "undefined", ...fetchOptions } = options;

  // Helper to get access token
  const getAccessToken = async () => {
    if (isServer) {
      return (await cookies()).get("accessToken")?.value;
    }
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  };

  // Helper to make the actual request
  const makeRequest = async (token?: string): Promise<Response> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${BASE_URL}/${url}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });
  };

  // First attempt
  let accessToken = await getAccessToken();
  let response = await makeRequest(accessToken);

  // Handle 401 - try to refresh token
  if (response.status === 401) {
    const refreshed = await tokenRefreshManager.refresh(isServer);

    if (refreshed) {
      // Get the new access token and retry
      accessToken = await getAccessToken();
      response = await makeRequest(accessToken);
    } else {
      // Refresh failed - redirect to login or throw error
      if (!isServer) {
        window.location.href = "/login";
      }
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  // Handle other errors
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Convenience methods
export const fetcherGet = async <T = any>(
  url: string,
  options?: FetcherOptions,
) => await fetcher<T>(url, { ...options, method: "GET" });

// export const fetcherPost = <T = any>(
//   url: string,
//   body?: any,
//   options?: FetcherOptions,
// ) =>
//   fetcher<T>(url, { ...options, method: "POST", body: JSON.stringify(body) });

// export const fetcherPut = <T = any>(
//   url: string,
//   body?: any,
//   options?: FetcherOptions,
// ) => fetcher<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) });

// export const fetcherDelete = <T = any>(url: string, options?: FetcherOptions) =>
//   fetcher<T>(url, { ...options, method: "DELETE" });
