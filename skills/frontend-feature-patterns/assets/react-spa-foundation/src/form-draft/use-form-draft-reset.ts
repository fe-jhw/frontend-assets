import { useEffect, useRef } from "react"
import type { FieldValues, UseFormReset } from "react-hook-form"

export function useFormDraftReset<TFieldValues extends FieldValues>({
  defaultValuesKey,
  defaultValues,
  isDirty,
  reset,
  resetKey
}: {
  defaultValuesKey: string
  defaultValues: TFieldValues
  isDirty: boolean
  reset: UseFormReset<TFieldValues>
  resetKey: string
}) {
  const lastResetRef = useRef({ defaultValuesKey, resetKey })

  useEffect(() => {
    if (lastResetRef.current.resetKey !== resetKey) {
      reset(defaultValues)
      lastResetRef.current = { defaultValuesKey, resetKey }
      return
    }

    if (!isDirty && lastResetRef.current.defaultValuesKey !== defaultValuesKey) {
      reset(defaultValues)
      lastResetRef.current = { defaultValuesKey, resetKey }
    }
  }, [defaultValues, defaultValuesKey, isDirty, reset, resetKey])
}
