// components/EditorErrorBoundary.tsx
"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class EditorErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Editor error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Editor failed to load. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

export default EditorErrorBoundary;
