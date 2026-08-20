import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ItemForm } from "@/features/items/ItemForm"

describe("ItemForm", () => {
  it("focuses the invalid field and does not call submit", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ItemForm
        defaultValues={{ name: "", status: "active" }}
        onCancel={() => undefined}
        onDirtyChange={() => undefined}
        onSubmit={onSubmit}
        resetKey="create"
      />
    )
    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(await screen.findByText("Name is required.")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("preserves the draft and shows a root server error after submit fails", async () => {
    const user = userEvent.setup()

    render(
      <ItemForm
        defaultValues={{ name: "Draft item", status: "active" }}
        onCancel={() => undefined}
        onDirtyChange={() => undefined}
        onSubmit={async () => {
          throw new Error("Save failed")
        }}
        resetKey="create"
      />
    )
    await user.click(screen.getByRole("button", { name: "Save" }))

    expect(await screen.findByRole("alert")).toHaveTextContent("Save failed")
    expect(screen.getByRole("alert")).toHaveFocus()
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Draft item")
  })

  it("uses the form submit lifecycle to prevent duplicate submissions", async () => {
    const user = userEvent.setup()
    let resolveSubmit: () => void = () => undefined
    const pendingSubmit = new Promise<void>((resolve) => {
      resolveSubmit = resolve
    })
    const onSubmit = vi.fn(() => pendingSubmit)

    render(
      <ItemForm
        defaultValues={{ name: "Ready", status: "active" }}
        onCancel={() => undefined}
        onDirtyChange={() => undefined}
        onSubmit={onSubmit}
        resetKey="create"
      />
    )

    const submitButton = screen.getByRole("button", { name: "Save" })
    await user.click(submitButton)
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Saving…" }))
    expect(onSubmit).toHaveBeenCalledOnce()

    await act(async () => resolveSubmit())
    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeEnabled())
  })
})
