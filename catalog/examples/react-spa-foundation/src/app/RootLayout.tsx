import { Outlet } from "react-router"

import { DiscardChangesProvider } from "@/form-draft/discard-changes-provider"

export function RootLayout() {
  return (
    <DiscardChangesProvider>
      <Outlet />
    </DiscardChangesProvider>
  )
}
