export type QueryViewState<TData> =
  | { kind: "pending"; data: null; errorMessage: null }
  | { kind: "error"; data: null; errorMessage: string }
  | { kind: "ready"; data: TData; errorMessage: string | null }

type QueryViewStateSource<TData> = {
  data: TData | null | undefined
  error: Error | null
  isError: boolean
}

export function getQueryViewState<TData>(
  { data, error, isError }: QueryViewStateSource<TData>,
  fallbackMessage = "The request failed."
): QueryViewState<TData> {
  const errorMessage = isError ? (error?.message ?? fallbackMessage) : null

  if (data != null) {
    return { kind: "ready", data, errorMessage }
  }

  if (errorMessage) {
    return { kind: "error", data: null, errorMessage }
  }

  return { kind: "pending", data: null, errorMessage: null }
}
