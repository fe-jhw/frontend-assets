import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import { createApiClient } from "@/api-client/api-client"
import { RootLayout } from "@/app/RootLayout"
import { createMemoryTokenStore } from "@/auth/token-store"
import { ResettableErrorBoundary } from "@/error/resettable-error-boundary"
import { ItemCreateRoute } from "@/features/items/ItemCreateRoute"
import { ItemsPage } from "@/features/items/ItemsPage"

const apiClient = createApiClient({
  baseUrl: "/api",
  tokenStore: createMemoryTokenStore()
})
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <ItemsPage client={apiClient} /> },
      { path: "/items/new", element: <ItemCreateRoute client={apiClient} /> }
    ]
  }
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ResettableErrorBoundary
            onReset={reset}
            fallback={({ reset: resetBoundary }) => (
              <main>
                <h1>Unable to render the page</h1>
                <button onClick={resetBoundary}>Retry</button>
              </main>
            )}
          >
            <RouterProvider router={router} />
          </ResettableErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  </StrictMode>
)
