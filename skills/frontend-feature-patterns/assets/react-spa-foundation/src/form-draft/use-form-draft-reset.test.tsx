import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { useFormDraftReset } from "@/form-draft/use-form-draft-reset"

type Values = {
  name: string
}

function Harness({ defaultName, resetKey }: { defaultName: string; resetKey: string }) {
  const form = useForm<Values>({ defaultValues: { name: defaultName } })
  const defaultValues = { name: defaultName }

  useFormDraftReset({
    defaultValues,
    defaultValuesKey: defaultName,
    isDirty: form.formState.isDirty,
    reset: form.reset,
    resetKey
  })

  return <input aria-label="Name" {...form.register("name")} />
}

describe("useFormDraftReset", () => {
  it("preserves a dirty draft for the same form identity", async () => {
    const user = userEvent.setup()
    const view = render(<Harness defaultName="Initial" resetKey="item-1" />)

    await user.clear(screen.getByRole("textbox", { name: "Name" }))
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Draft")
    view.rerender(<Harness defaultName="Refetched" resetKey="item-1" />)

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Draft")
  })

  it("resets when the form identity changes", async () => {
    const user = userEvent.setup()
    const view = render(<Harness defaultName="First" resetKey="item-1" />)

    await user.clear(screen.getByRole("textbox", { name: "Name" }))
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Draft")
    view.rerender(<Harness defaultName="Second" resetKey="item-2" />)

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Second")
  })
})
