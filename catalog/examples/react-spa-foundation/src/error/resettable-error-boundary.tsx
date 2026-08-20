import { Component, type ReactNode } from "react"

type ErrorFallbackProps = {
  error: Error
  reset: () => void
}

type ResettableErrorBoundaryProps = {
  children: ReactNode
  fallback: (props: ErrorFallbackProps) => ReactNode
  onReset?: () => void
  resetKey?: string
}

export class ResettableErrorBoundary extends Component<
  ResettableErrorBoundaryProps,
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(previousProps: Readonly<ResettableErrorBoundaryProps>) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.reset()
    }
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({ error: this.state.error, reset: this.reset })
    }

    return this.props.children
  }
}
