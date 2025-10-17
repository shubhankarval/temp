import { fetcher } from "../fetcher"

describe("fetcher", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
    global.fetch = originalFetch
  })

  it("should perform a GET request successfully", async () => {
    const mockData = { name: "John Doe" }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    })

    const result = await fetcher("/users")

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({
        method: "GET",
        mode: "cors",
      })
    )

    expect(result).toEqual(mockData)
  })

  it("should append query params correctly", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await fetcher("/users", { params: { role: "admin", page: 2 } })

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0]
    expect(calledUrl).toBe("/api/users?role=admin&page=2")
  })

  it("should send POST body when data and method are POST", async () => {
    const payload = { username: "john" }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({}),
    })

    await fetcher("/users", { method: "POST", data: payload })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    )
  })

  it("should not include body when method is GET", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await fetcher("/users", { data: { name: "ignored" } })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/users",
      expect.not.objectContaining({ body: expect.anything() })
    )
  })

  it("should throw on non-ok responses", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    })

    await expect(fetcher("/users")).rejects.toThrow("HTTP 500 - Server Error")
  })
})
