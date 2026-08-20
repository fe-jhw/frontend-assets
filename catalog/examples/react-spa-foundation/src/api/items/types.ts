export type ItemStatus = "active" | "archived"

export type Item = {
  id: string
  name: string
  status: ItemStatus
}

export type ItemListParams = {
  page: number
  query: string
  size: number
  status: "all" | ItemStatus
}

export type ItemPage = {
  items: Item[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type CreateItemCommand = {
  name: string
  status: ItemStatus
}
