import LoadingSpinner from '../components/LoadingSpinner'

// `LoadingSpinner` (and its helper module) is in the *loading boundary's module
// graph*, so its chunk shows up in `entryJSFiles["[project]/app/loading"]` of
// the client reference manifest. It is deliberately NOT rendered, which is the
// minimal stand-in for the reporter's "boundary-only chunk": no client
// reference that IS serialized for this request pulls that chunk in, so nothing
// preinits it with the nonce and React's hoistable dedupe cannot hide the
// nonce-less <script> emitted by createComponentStylesAndScripts().
const SHOW_SPINNER = process.env.SHOW_SPINNER === '1'

export default function Loading() {
  return <div>{SHOW_SPINNER ? <LoadingSpinner /> : 'loading…'}</div>
}
