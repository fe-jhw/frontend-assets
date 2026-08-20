import { describe, expect, it } from "vitest"

import { createEntityQueryKeys } from "@/query/create-entity-query-keys"
import { getQueryViewState } from "@/query/query-view-state"

describe("query foundation", () => {
  it("keeps list and detail keys in separate namespaces", () => {
    const keys = createEntityQueryKeys("items")

    expect(keys.list({ page: 2 })).toEqual(["app", "items", "list", { page: 2 }])
    expect(keys.detail("item-1")).toEqual(["app", "items", "detail", "item-1"])
  })

  it("keeps existing data visible when a background request fails", () => {
    expect(
      getQueryViewState({
        data: { value: "cached" },
        error: new Error("Refresh failed"),
        isError: true
      })
    ).toEqual({
      kind: "ready",
      data: { value: "cached" },
      errorMessage: "Refresh failed"
    })
  })

  it("uses a blocking error only when no data exists", () => {
    expect(
      getQueryViewState({
        data: undefined,
        error: new Error("Initial request failed"),
        isError: true
      })
    ).toEqual({
      kind: "error",
      data: null,
      errorMessage: "Initial request failed"
    })
  })
})
