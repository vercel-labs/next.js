'use client'

import { outer } from '../actions'
import { ReturnedNestedAction } from '../client'

export function ImportedClient() {
  return <ReturnedNestedAction outer={outer} />
}
