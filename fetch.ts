// src/lib/fetcher.ts
export type FetchOptions = {
  method?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  data?: unknown
}

export async function fetcher<T>(
  endpoint: string,
  { method = "GET", headers = {}, params, data }: FetchOptions = {}
): Promise<T> {
  const url = `/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : ""

  const res = await fetch(`${url}${query}`, {
    method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: method === "POST" && data ? JSON.stringify(data) : undefined,
  })

  if (!res.ok) {
    // Throw so TanStack Query can catch and handle it
    throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
