import { useCallback } from "react"

import type { ApiClient } from "@/api-client/api-client"
import { useCreateItemMutation } from "@/api/items/mutations"
import type { Item } from "@/api/items/types"
import { ItemForm, type ItemFormValues } from "@/features/items/ItemForm"
import { useDiscardChangesGuard } from "@/form-draft/use-discard-changes-guard"

const emptyItem: ItemFormValues = {
  name: "",
  status: "active"
}

type ItemCreatePageProps = {
  client: ApiClient
  onCancel: () => void
  onCreated: (item: Item) => void
}

export function ItemCreatePage({ client, onCancel, onCreated }: ItemCreatePageProps) {
  const mutation = useCreateItemMutation(client)
  const draftGuard = useDiscardChangesGuard()

  const submit = useCallback(
    async (command: ItemFormValues) => {
      const item = await mutation.mutateAsync(command)
      draftGuard.markClean()
      onCreated(item)
    },
    [draftGuard, mutation, onCreated]
  )

  return (
    <main>
      <h1>Create item</h1>
      <ItemForm
        defaultValues={emptyItem}
        onCancel={() => draftGuard.requestTransition(onCancel)}
        onDirtyChange={draftGuard.setIsDirty}
        onSubmit={submit}
        pending={mutation.isPending}
        resetKey="create-item"
      />
    </main>
  )
}
