import {
  type ChangeEvent,
  type CompositionEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

export function useCommittedSearchInput(committedValue: string, commit: (value: string) => void) {
  const [draft, setDraft] = useState(committedValue)
  const isComposingRef = useRef(false)

  useEffect(() => {
    if (!isComposingRef.current) {
      setDraft(committedValue)
    }
  }, [committedValue])

  const submit = useCallback(() => commit(draft), [commit, draft])
  const clear = useCallback(() => {
    setDraft("")
    commit("")
  }, [commit])

  return {
    clear,
    inputProps: {
      value: draft,
      onChange: (event: ChangeEvent<HTMLInputElement>) => setDraft(event.currentTarget.value),
      onCompositionStart: () => {
        isComposingRef.current = true
      },
      onCompositionEnd: (event: CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false
        setDraft(event.currentTarget.value)
      },
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter" || isComposingRef.current || event.nativeEvent.isComposing) {
          return
        }

        event.preventDefault()
        submit()
      }
    },
    submit
  }
}
