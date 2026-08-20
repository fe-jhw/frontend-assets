import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { useBlocker } from "react-router"

import {
  DiscardChangesContext,
  type DiscardChangesRegistry
} from "@/form-draft/discard-changes-context"

export type DiscardChangesPromptProps = {
  onDiscard: () => void
  onKeepEditing: () => void
  open: boolean
}

type DiscardChangesProviderProps = {
  children: ReactNode
  PromptComponent?: ComponentType<DiscardChangesPromptProps>
}

type PendingTransition = {
  ownerId: string
  transition: () => void
}

function DefaultDiscardChangesPrompt({
  onDiscard,
  onKeepEditing,
  open
}: DiscardChangesPromptProps) {
  if (!open) {
    return null
  }

  return (
    <div aria-modal="true" role="dialog">
      <p>Discard unsaved changes?</p>
      <button onClick={onKeepEditing}>Keep editing</button>
      <button onClick={onDiscard}>Discard</button>
    </div>
  )
}

export function DiscardChangesProvider({
  children,
  PromptComponent = DefaultDiscardChangesPrompt
}: DiscardChangesProviderProps) {
  const parentRegistry = useContext(DiscardChangesContext)
  if (parentRegistry) {
    return children
  }

  return (
    <DiscardChangesProviderRoot PromptComponent={PromptComponent}>
      {children}
    </DiscardChangesProviderRoot>
  )
}

function DiscardChangesProviderRoot({
  children,
  PromptComponent
}: {
  children: ReactNode
  PromptComponent: ComponentType<DiscardChangesPromptProps>
}) {
  const dirtyOwnersRef = useRef(new Set<string>())
  const pendingTransitionRef = useRef<PendingTransition | null>(null)
  const [dirtyOwnerCount, setDirtyOwnerCount] = useState(0)
  const [isInternalPromptOpen, setIsInternalPromptOpen] = useState(false)
  const blocker = useBlocker(
    useCallback(() => {
      return dirtyOwnersRef.current.size > 0
    }, [])
  )

  const cleanOwner = useCallback((ownerId: string) => {
    if (dirtyOwnersRef.current.delete(ownerId)) {
      setDirtyOwnerCount(dirtyOwnersRef.current.size)
    }

    if (pendingTransitionRef.current?.ownerId === ownerId) {
      pendingTransitionRef.current = null
      setIsInternalPromptOpen(false)
    }
  }, [])

  const setIsDirty = useCallback(
    (ownerId: string, isDirty: boolean) => {
      if (!isDirty) {
        cleanOwner(ownerId)
        return
      }

      if (!dirtyOwnersRef.current.has(ownerId)) {
        dirtyOwnersRef.current.add(ownerId)
        setDirtyOwnerCount(dirtyOwnersRef.current.size)
      }
    },
    [cleanOwner]
  )

  const requestTransition = useCallback((ownerId: string, transition: () => void) => {
    if (!dirtyOwnersRef.current.has(ownerId)) {
      transition()
      return
    }

    pendingTransitionRef.current = { ownerId, transition }
    setIsInternalPromptOpen(true)
  }, [])

  const registry = useMemo<DiscardChangesRegistry>(
    () => ({
      markClean: cleanOwner,
      requestTransition,
      setIsDirty,
      unregister: cleanOwner
    }),
    [cleanOwner, requestTransition, setIsDirty]
  )

  const keepEditing = useCallback(() => {
    pendingTransitionRef.current = null
    setIsInternalPromptOpen(false)
    if (blocker.state === "blocked") {
      blocker.reset()
    }
  }, [blocker])

  const discardChanges = useCallback(() => {
    const pendingTransition = pendingTransitionRef.current
    pendingTransitionRef.current = null
    setIsInternalPromptOpen(false)

    if (blocker.state === "blocked") {
      dirtyOwnersRef.current.clear()
      setDirtyOwnerCount(0)
      blocker.proceed()
      return
    }

    if (pendingTransition) {
      cleanOwner(pendingTransition.ownerId)
      pendingTransition.transition()
    }
  }, [blocker, cleanOwner])

  useEffect(() => {
    if (dirtyOwnerCount === 0) {
      return
    }

    const preventUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = true
    }

    window.addEventListener("beforeunload", preventUnload)
    return () => window.removeEventListener("beforeunload", preventUnload)
  }, [dirtyOwnerCount])

  return (
    <DiscardChangesContext value={registry}>
      {children}
      <PromptComponent
        onDiscard={discardChanges}
        onKeepEditing={keepEditing}
        open={isInternalPromptOpen || blocker.state === "blocked"}
      />
    </DiscardChangesContext>
  )
}
