import { ApolloClient, InMemoryCache } from '@apollo/client'
import * as Sentry from '@sentry/react'
import axios from 'axios'
import dayjs from 'dayjs'
import { initializeApp } from 'firebase/app'
import { chunk } from 'lodash-es'
import { evaluate } from 'mathjs'

export default function Home() {
  return (
    <div>
      {String(
        typeof ApolloClient +
          typeof InMemoryCache +
          typeof Sentry.init +
          typeof axios +
          typeof dayjs +
          typeof initializeApp +
          typeof chunk +
          evaluate('1 + 1')
      )}
    </div>
  )
}
