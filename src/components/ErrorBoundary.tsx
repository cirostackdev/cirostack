'use client';

import { Component, type ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-sm font-medium text-[var(--color-text)] mb-1">Something went wrong</p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4 max-w-sm">{this.state.message}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
