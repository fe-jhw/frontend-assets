import type { ApiClient } from "@/api-client/api-client"
import { parseItem, parseItemPage } from "@/api/items/schemas"
import type { CreateItemCommand, ItemListParams } from "@/api/items/types"

export function listItems(client: ApiClient, params: ItemListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    query: params.query,
    size: String(params.size),
    status: params.status
  })

  return client.request(`/items?${searchParams}`, { parse: parseItemPage })
}

export function createItem(client: ApiClient, command: CreateItemCommand) {
  return client.request("/items", {
    body: command,
    method: "POST",
    parse: parseItem
  })
}
