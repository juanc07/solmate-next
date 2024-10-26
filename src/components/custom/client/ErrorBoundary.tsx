"use client";  // Ensures this component runs on the client side

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;  // Custom fallback UI passed as a prop
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {  // Renamed `_` to `_error`
    // Update state to trigger fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render the custom fallback UI if provided, otherwise default message
      return this.props.fallback || <h1>Something went wrong. Please try again later.</h1>;
    }
    // Render the children components if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
