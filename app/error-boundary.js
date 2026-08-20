'use client'

import React from 'react'

export class MyErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error) {
    console.log('[MyErrorBoundary] caught:', error && (error.digest || error.message))
  }
  render() {
    if (this.state.error) {
      return (
        <p id="boundary-fallback">
          CAUGHT BY ERROR BOUNDARY: digest={String(this.state.error.digest)}
        </p>
      )
    }
    return this.props.children
  }
}
