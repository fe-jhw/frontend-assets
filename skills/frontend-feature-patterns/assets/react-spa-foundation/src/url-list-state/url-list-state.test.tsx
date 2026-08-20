import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { describe, expect, it } from "vitest"

import { useCommittedSearchInput } from "@/url-list-state/use-committed-search-input"
import { useUrlPagination } from "@/url-list-state/use-url-pagination"
import { useUrlSearch } from "@/url-list-state/use-url-search"

function SearchHarness() {
  const location = useLocation()
  const { query, setQuery } = useUrlSearch()
  const searchInput = useCommittedSearchInput(query, setQuery)

  return (
    <>
      <input aria-label="Search" {...searchInput.inputProps} />
      <button onClick={searchInput.clear}>Clear</button>
      <output aria-label="Location">{location.search}</output>
    </>
  )
}

function PaginationHarness() {
  const location = useLocation()
  const pagination = useUrlPagination()

  return (
    <>
      <span>{pagination.page}</span>
      <span>{pagination.size}</span>
      <output aria-label="Location">{location.search}</output>
    </>
  )
}

describe("URL list state", () => {
  it("does not commit Enter while an IME composition is active", () => {
    render(
      <MemoryRouter>
        <SearchHarness />
      </MemoryRouter>
    )
    const input = screen.getByRole("textbox", { name: "Search" })

    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: "검색" } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(screen.getByLabelText("Location")).toHaveTextContent("")

    fireEvent.compositionEnd(input)
    fireEvent.keyDown(input, { key: "Enter" })
    expect(screen.getByLabelText("Location")).toHaveTextContent("?query=%EA%B2%80%EC%83%89")
  })

  it("normalizes unsupported page sizes and resets the page", async () => {
    render(
      <MemoryRouter initialEntries={["/?page=8&size=999"]}>
        <PaginationHarness />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText("20")).toBeInTheDocument())
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByLabelText("Location")).toHaveTextContent("")
  })
})
