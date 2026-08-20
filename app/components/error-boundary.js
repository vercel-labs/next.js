'use client';
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <p id="custom-fallback">Custom ErrorBoundary caught: {String(this.state.error.message)}</p>;
    }
    return this.props.children;
  }
}
