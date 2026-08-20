import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { useLocalPagination } from "@/local-list-state/use-local-pagination"

function LocalPaginationHarness() {
  const pagination = useLocalPagination({ initialPage: 3 })

  return (
    <>
      <output aria-label="Page">{pagination.page}</output>
      <output aria-label="Size">{pagination.size}</output>
      <button onClick={() => pagination.setPage(4)}>Next</button>
      <button onClick={() => pagination.setPage(0)}>Use invalid page</button>
      <button onClick={() => pagination.setSize(50)}>Use 50</button>
      <button onClick={() => pagination.setSize(999)}>Use invalid size</button>
      <button onClick={pagination.resetPage}>Reset page</button>
    </>
  )
}

describe("local pagination", () => {
  it("keeps page and size in component state", async () => {
    const user = userEvent.setup()
    render(<LocalPaginationHarness />)

    expect(screen.getByLabelText("Page")).toHaveTextContent("3")
    expect(screen.getByLabelText("Size")).toHaveTextContent("20")

    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByLabelText("Page")).toHaveTextContent("4")

    await user.click(screen.getByRole("button", { name: "Use invalid page" }))
    expect(screen.getByLabelText("Page")).toHaveTextContent("1")

    await user.click(screen.getByRole("button", { name: "Next" }))
    await user.click(screen.getByRole("button", { name: "Use 50" }))
    expect(screen.getByLabelText("Page")).toHaveTextContent("1")
    expect(screen.getByLabelText("Size")).toHaveTextContent("50")
  })

  it("falls back to the default size and exposes an explicit page reset", async () => {
    const user = userEvent.setup()
    render(<LocalPaginationHarness />)

    await user.click(screen.getByRole("button", { name: "Use invalid size" }))
    expect(screen.getByLabelText("Page")).toHaveTextContent("1")
    expect(screen.getByLabelText("Size")).toHaveTextContent("20")

    await user.click(screen.getByRole("button", { name: "Next" }))
    await user.click(screen.getByRole("button", { name: "Reset page" }))
    expect(screen.getByLabelText("Page")).toHaveTextContent("1")
  })
})
