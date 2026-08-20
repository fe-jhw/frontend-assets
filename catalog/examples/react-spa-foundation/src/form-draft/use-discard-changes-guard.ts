import { useCallback, useContext, useEffect, useId } from "react"

import { DiscardChangesContext } from "@/form-draft/discard-changes-context"

export function useDiscardChangesGuard() {
  const registry = useContext(DiscardChangesContext)
  const ownerId = useId()

  useEffect(() => {
    if (!registry) {
      return
    }

    return () => registry.unregister(ownerId)
  }, [ownerId, registry])

  const markClean = useCallback(() => {
    registry?.markClean(ownerId)
  }, [ownerId, registry])

  const requestTransition = useCallback(
    (transition: () => void) => {
      registry?.requestTransition(ownerId, transition)
    },
    [ownerId, registry]
  )

  const setIsDirty = useCallback(
    (isDirty: boolean) => {
      registry?.setIsDirty(ownerId, isDirty)
    },
    [ownerId, registry]
  )

  if (!registry) {
    throw new Error("useDiscardChangesGuard must be used inside DiscardChangesProvider.")
  }

  return { markClean, requestTransition, setIsDirty }
}
