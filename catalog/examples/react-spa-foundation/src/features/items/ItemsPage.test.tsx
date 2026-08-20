import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { describe, expect, it, vi } from "vitest"

import type { ApiClient } from "@/api-client/api-client"
import type { ItemPage } from "@/api/items/types"
import { ItemsPage } from "@/features/items/ItemsPage"

function renderPage(client: ApiClient) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ItemsPage client={client} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe("ItemsPage", () => {
  it("renders the empty state and commits search through the URL boundary", async () => {
    const user = userEvent.setup()
    const page: ItemPage = {
      items: [],
      page: 1,
      size: 20,
      totalItems: 0,
      totalPages: 0
    }
    const request = vi.fn(async () => page)
    const client: ApiClient = { request: request as ApiClient["request"] }

    renderPage(client)
    expect(await screen.findByText("No items match the current filters.")).toBeInTheDocument()

    await user.type(screen.getByRole("textbox", { name: "Search" }), "new")
    await user.click(screen.getByRole("button", { name: "Search" }))

    await waitFor(() => {
      expect(request).toHaveBeenLastCalledWith(
        "/items?page=1&query=new&size=20&status=all",
        expect.objectContaining({ parse: expect.any(Function) })
      )
    })
    expect(screen.queryByText("Loading items…")).not.toBeInTheDocument()
  })
})
