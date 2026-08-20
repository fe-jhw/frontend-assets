import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import { createApiClient } from "@/api-client/api-client"
import { createMemoryTokenStore } from "@/auth/token-store"
import { ResettableErrorBoundary } from "@/error/resettable-error-boundary"
import { ItemsPage } from "@/features/items/ItemsPage"

const apiClient = createApiClient({
  baseUrl: "/api",
  tokenStore: createMemoryTokenStore()
})
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResettableErrorBoundary
      fallback={({ error, reset }) => (
        <main>
          <h1>Unable to render the page</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Retry</button>
        </main>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ItemsPage client={apiClient} />
        </BrowserRouter>
      </QueryClientProvider>
    </ResettableErrorBoundary>
  </StrictMode>
)
