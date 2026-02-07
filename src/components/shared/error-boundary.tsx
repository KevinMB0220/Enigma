'use client';

import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border-subtle bg-glass p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-white">
            Something went wrong
          </h3>
          <p className="mb-4 text-sm text-text-secondary">
            This section encountered an error. Please try again.
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw size={14} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
