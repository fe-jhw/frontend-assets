import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { createMemoryRouter, Link, Outlet, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { DiscardChangesProvider } from "@/form-draft/discard-changes-provider"
import { useDiscardChangesGuard } from "@/form-draft/use-discard-changes-guard"

function Layout() {
  return (
    <DiscardChangesProvider>
      <Outlet />
    </DiscardChangesProvider>
  )
}

function EditPage() {
  const [isDirty, setIsDirty] = useState(false)
  const guard = useDiscardChangesGuard()

  return (
    <main>
      <h1>Edit</h1>
      <button
        onClick={() => {
          setIsDirty(true)
          guard.setIsDirty(true)
        }}
      >
        Make dirty
      </button>
      <output aria-label="Dirty">{String(isDirty)}</output>
      <Link to="/next">Next</Link>
    </main>
  )
}

function renderRouter() {
  const router = createMemoryRouter(
    [
      {
        element: <Layout />,
        children: [
          { path: "/edit", element: <EditPage /> },
          { path: "/next", element: <h1>Next page</h1> }
        ]
      }
    ],
    { initialEntries: ["/edit"] }
  )

  render(<RouterProvider router={router} />)
}

describe("DiscardChangesProvider", () => {
  it("blocks data-router navigation and keeps focus in the confirmation flow", async () => {
    const user = userEvent.setup()
    renderRouter()

    await user.click(screen.getByRole("button", { name: "Make dirty" }))
    await user.click(screen.getByRole("link", { name: "Next" }))

    expect(screen.getByRole("heading", { name: "Edit" })).toBeInTheDocument()
    expect(screen.getByRole("dialog", { name: "Unsaved changes" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Keep editing" })).toHaveFocus()

    await user.click(screen.getByRole("button", { name: "Keep editing" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Next" })).toHaveFocus()

    await user.click(screen.getByRole("link", { name: "Next" }))
    await user.click(screen.getByRole("button", { name: "Discard" }))
    expect(await screen.findByRole("heading", { name: "Next page" })).toBeInTheDocument()
  })
})
