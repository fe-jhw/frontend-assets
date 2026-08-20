import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { ResettableErrorBoundary } from "@/error/resettable-error-boundary"

function Broken({ fail }: { fail: boolean }) {
  if (fail) {
    throw new Error("render failed")
  }

  return <p>ready</p>
}

describe("ResettableErrorBoundary", () => {
  it("renders a fallback and invokes the reset callback", () => {
    const onReset = vi.fn()

    function Harness() {
      const [fail, setFail] = useState(true)

      return (
        <ResettableErrorBoundary
          onReset={() => {
            onReset()
            setFail(false)
          }}
          fallback={({ error, reset }) => (
            <div>
              <p>{error.message}</p>
              <button onClick={reset}>Retry</button>
            </div>
          )}
        >
          <Broken fail={fail} />
        </ResettableErrorBoundary>
      )
    }

    render(<Harness />)
    expect(screen.getByText("render failed")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Retry" }))

    expect(onReset).toHaveBeenCalledOnce()
    expect(screen.getByText("ready")).toBeInTheDocument()
  })
})
