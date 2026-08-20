import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { ApiClient } from "@/api-client/api-client"
import { listItems } from "@/api/items/api"
import { itemQueryKeys } from "@/api/items/query-keys"
import type { ItemListParams } from "@/api/items/types"

export function itemListQueryOptions(client: ApiClient, params: ItemListParams) {
  return queryOptions({
    queryKey: itemQueryKeys.list(params),
    queryFn: () => listItems(client, params),
    placeholderData: keepPreviousData
  })
}
