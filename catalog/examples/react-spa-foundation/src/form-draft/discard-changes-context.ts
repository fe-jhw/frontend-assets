import { createContext } from "react"

export type DiscardChangesRegistry = {
  markClean: (ownerId: string) => void
  requestTransition: (ownerId: string, transition: () => void) => void
  setIsDirty: (ownerId: string, isDirty: boolean) => void
  unregister: (ownerId: string) => void
}

export const DiscardChangesContext = createContext<DiscardChangesRegistry | null>(null)
