import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ApiClient } from "@/api-client/api-client"
import { createItem } from "@/api/items/api"
import { itemQueryKeys } from "@/api/items/query-keys"

export function useCreateItemMutation(client: ApiClient) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: Parameters<typeof createItem>[1]) => createItem(client, command),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: itemQueryKeys.lists() })
    }
  })
}
