import {
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
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

function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") {
    return
  }

  const focusableElements = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
  const firstElement = focusableElements.at(0)
  const lastElement = focusableElements.at(-1)
  if (!firstElement || !lastElement) {
    event.preventDefault()
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

function DefaultDiscardChangesPrompt({
  onDiscard,
  onKeepEditing,
  open
}: DiscardChangesPromptProps) {
  const descriptionId = useId()
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const keepEditingButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    const previousActiveElement = document.activeElement

    try {
      dialog.showModal()
    } catch {
      // jsdom and older test environments may not implement the modal dialog API.
      dialog.setAttribute("open", "")
    }

    keepEditingButtonRef.current?.focus()
    return () => {
      if (dialog.open) {
        if (typeof dialog.close === "function") {
          dialog.close()
        } else {
          dialog.removeAttribute("open")
        }
      }
      if (previousActiveElement instanceof HTMLElement && previousActiveElement.isConnected) {
        previousActiveElement.focus()
      }
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onKeepEditing()
      }}
      onKeyDown={containDialogFocus}
    >
      <h2 id={titleId}>Unsaved changes</h2>
      <p id={descriptionId}>Discard unsaved changes?</p>
      <button ref={keepEditingButtonRef} onClick={onKeepEditing}>
        Keep editing
      </button>
      <button onClick={onDiscard}>Discard</button>
    </dialog>
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
