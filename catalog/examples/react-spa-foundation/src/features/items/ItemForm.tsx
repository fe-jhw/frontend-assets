import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef } from "react"
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
  const serverErrorRef = useRef<HTMLDivElement>(null)
  const { errors, isDirty, isSubmitting } = form.formState
  const isSaving = pending || isSubmitting
  const serverErrorMessage = errors.root?.server?.message

  useFormDraftReset({
    defaultValues,
    defaultValuesKey,
    isDirty,
    reset: form.reset,
    resetKey
  })

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  useEffect(() => {
    if (serverErrorMessage) {
      serverErrorRef.current?.focus()
    }
  }, [serverErrorMessage])

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
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "item-name-error" : undefined}
          required
          {...form.register("name")}
        />
        {errors.name && (
          <p id="item-name-error" role="alert">
            {errors.name.message}
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

      {serverErrorMessage && (
        <div ref={serverErrorRef} role="alert" tabIndex={-1}>
          {serverErrorMessage}
        </div>
      )}

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button disabled={isSaving} type="submit">
        {isSaving ? "Saving…" : "Save"}
      </button>
    </form>
  )
}
