import { describe, expect, it, vi } from "vitest"

import type { ApiClient } from "@/api-client/api-client"
import { createItem, listItems } from "@/api/items/api"

describe("items API adapter", () => {
  it("keeps transport paths and runtime parsers outside the feature", async () => {
    const request = vi.fn(async () => ({
      items: [],
      page: 1,
      size: 20,
      totalItems: 0,
      totalPages: 0
    }))
    const client: ApiClient = { request: request as unknown as ApiClient["request"] }

    await listItems(client, {
      page: 1,
      query: "term",
      size: 20,
      status: "active"
    })

    expect(request).toHaveBeenCalledWith(
      "/items?page=1&query=term&size=20&status=active",
      expect.objectContaining({ parse: expect.any(Function) })
    )
  })

  it("validates create responses at the API boundary", async () => {
    const request: ApiClient["request"] = async (_path, options) => {
      if (!options?.parse) {
        throw new Error("Parser is required for this test.")
      }

      return options.parse({ id: "item-1", name: "One", status: "active" })
    }
    const client: ApiClient = { request }

    await expect(createItem(client, { name: "One", status: "active" })).resolves.toEqual({
      id: "item-1",
      name: "One",
      status: "active"
    })
  })
})
