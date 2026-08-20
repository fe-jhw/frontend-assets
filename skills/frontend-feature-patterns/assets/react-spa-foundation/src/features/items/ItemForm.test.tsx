import { render, screen } from "@testing-library/react"
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
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Draft item")
  })
})
