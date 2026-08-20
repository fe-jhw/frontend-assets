import { useNavigate } from "react-router"

import type { ApiClient } from "@/api-client/api-client"
import { ItemCreatePage } from "@/features/items/ItemCreatePage"

export function ItemCreateRoute({ client }: { client: ApiClient }) {
  const navigate = useNavigate()

  return (
    <ItemCreatePage
      client={client}
      onCancel={() => navigate("/")}
      onCreated={() => navigate("/")}
    />
  )
}
