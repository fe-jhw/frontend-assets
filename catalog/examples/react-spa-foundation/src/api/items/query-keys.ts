import type { ItemListParams } from "@/api/items/types"
import { createEntityQueryKeys } from "@/query/create-entity-query-keys"

const entityKeys = createEntityQueryKeys("items")

export const itemQueryKeys = {
  ...entityKeys,
  list: (params: ItemListParams) => [...entityKeys.lists(), params] as const
}
