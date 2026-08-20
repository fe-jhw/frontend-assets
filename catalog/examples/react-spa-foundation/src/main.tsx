import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"

import { createApiClient } from "@/api-client/api-client"
import { RootLayout } from "@/app/RootLayout"
import { createMemoryTokenStore } from "@/auth/token-store"
import { ResettableErrorBoundary } from "@/error/resettable-error-boundary"
import { ItemsPage } from "@/features/items/ItemsPage"

const apiClient = createApiClient({
  baseUrl: "/api",
  tokenStore: createMemoryTokenStore()
})
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    hydrateFallbackElement: <p role="status">Loading page…</p>,
    children: [
      { path: "/", element: <ItemsPage client={apiClient} /> },
      {
        path: "/items/new",
        lazy: async () => {
          const { ItemCreateRoute } = await import("@/features/items/ItemCreateRoute")
          return {
            Component: function ItemCreateRouteElement() {
              return <ItemCreateRoute client={apiClient} />
            }
          }
        }
      }
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
