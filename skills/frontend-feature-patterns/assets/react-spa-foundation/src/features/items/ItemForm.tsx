import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { userFacingErrorMessage } from "@/api-client/api-error"
import type { CreateItemCommand } from "@/api/items/types"
import { useFormDraftReset } from "@/form-draft/use-form-draft-reset"

const itemFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Use 100 characters or fewer."),
  status: z.enum(["active", "archived"])
})

export type ItemFormValues = z.infer<typeof itemFormSchema>

type ItemFormProps = {
  defaultValuesKey?: string
  defaultValues: ItemFormValues
  onCancel: () => void
  onDirtyChange: (isDirty: boolean) => void
  onSubmit: (command: CreateItemCommand) => Promise<void>
  pending?: boolean
  resetKey: string
}

export function ItemForm({
  defaultValues,
  resetKey,
  defaultValuesKey = resetKey,
  onCancel,
  onDirtyChange,
  onSubmit,
  pending = false
}: ItemFormProps) {
  const form = useForm<ItemFormValues>({
    defaultValues,
    delayError: 300,
    mode: "onSubmit",
    resolver: zodResolver(itemFormSchema),
    shouldFocusError: true
  })

  useFormDraftReset({
    defaultValues,
    defaultValuesKey,
    isDirty: form.formState.isDirty,
    reset: form.reset,
    resetKey
  })

  useEffect(() => {
    onDirtyChange(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      form.setError("root.server", {
        message: userFacingErrorMessage(error, "Unable to save the item."),
        type: "server"
      })
    }
  })

  return (
    <form noValidate onSubmit={submit}>
      <div>
        <label htmlFor="item-name">Name</label>
        <input
          id="item-name"
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-describedby={form.formState.errors.name ? "item-name-error" : undefined}
          required
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p id="item-name-error" role="alert">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="item-status">Status</label>
        <select id="item-status" {...form.register("status")}>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {form.formState.errors.root?.server && (
        <div role="alert" tabIndex={-1}>
          {form.formState.errors.root.server.message}
        </div>
      )}

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button disabled={pending} type="submit">
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  )
}
