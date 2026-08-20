import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Link } from "react-router"

import type { ApiClient } from "@/api-client/api-client"
import { itemListQueryOptions } from "@/api/items/queries"
import type { ItemStatus } from "@/api/items/types"
import { userFacingErrorMessage } from "@/api-client/api-error"
import { getQueryViewState } from "@/query/query-view-state"
import { useCommittedSearchInput } from "@/url-list-state/use-committed-search-input"
import { useUrlFilter } from "@/url-list-state/use-url-filter"
import { useUrlPagination } from "@/url-list-state/use-url-pagination"
import { useUrlSearch } from "@/url-list-state/use-url-search"

const itemStatusOptions = ["all", "active", "archived"] as const
type ItemStatusFilter = "all" | ItemStatus

export function ItemsPage({ client }: { client: ApiClient }) {
  const { query, setQuery } = useUrlSearch()
  const searchInput = useCommittedSearchInput(query, setQuery)
  const statusFilter = useUrlFilter<ItemStatusFilter>("status", {
    allowedValues: itemStatusOptions,
    defaultValue: "all"
  })
  const { page: requestedPage, setPage, size } = useUrlPagination()
  const listQuery = useQuery(
    itemListQueryOptions(client, {
      page: requestedPage,
      query,
      size,
      status: statusFilter.value
    })
  )
  const viewState = getQueryViewState(listQuery)
  const resolvedPage = viewState.kind === "ready" ? viewState.data.page : null

  useEffect(() => {
    if (resolvedPage !== null && !listQuery.isPlaceholderData && resolvedPage !== requestedPage) {
      setPage(resolvedPage, { replace: true })
    }
  }, [listQuery.isPlaceholderData, requestedPage, resolvedPage, setPage])

  if (viewState.kind === "pending") {
    return <p role="status">Loading items…</p>
  }

  if (viewState.kind === "error") {
    return (
      <section role="alert">
        <p>{viewState.errorMessage}</p>
        <button onClick={() => void listQuery.refetch()}>Retry</button>
      </section>
    )
  }

  const page = viewState.data

  return (
    <main>
      <h1>Items</h1>
      <Link to="/items/new">Create item</Link>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          searchInput.submit()
        }}
      >
        <label htmlFor="item-search">Search</label>
        <input id="item-search" {...searchInput.inputProps} />
        <button type="submit">Search</button>
        <button type="button" onClick={searchInput.clear}>
          Clear
        </button>
      </form>

      <label htmlFor="item-status-filter">Status</label>
      <select
        id="item-status-filter"
        value={statusFilter.value}
        onChange={(event) => statusFilter.setValue(event.currentTarget.value as ItemStatusFilter)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>

      {viewState.errorMessage && (
        <p role="status">{userFacingErrorMessage(listQuery.error, viewState.errorMessage)}</p>
      )}

      {page.items.length === 0 ? (
        <section>
          <p>No items match the current filters.</p>
        </section>
      ) : (
        <ul>
          {page.items.map((item) => (
            <li key={item.id}>
              {item.name} — {item.status}
            </li>
          ))}
        </ul>
      )}

      <nav aria-label="Pagination">
        <button disabled={page.page <= 1} onClick={() => setPage(page.page - 1)} type="button">
          Previous
        </button>
        <span>
          Page {page.page} of {Math.max(1, page.totalPages)}
        </span>
        <button
          disabled={page.page >= page.totalPages}
          onClick={() => setPage(page.page + 1)}
          type="button"
        >
          Next
        </button>
      </nav>
    </main>
  )
}
