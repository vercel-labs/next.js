import Router from 'next/router'

const MyComponent = ({ query, where }) => {
  return (
    <div>
      <div id="test">test: {String(query.test)}</div>
      <div id="where">where: {where}</div>
      <button
        id="no-hash"
        onClick={() => {
          const n = Number(Router.query.test || 0) + 1
          Router.replace(`/?test=${n}`, Router.asPath.split('#')[0])
        }}
      >
        replace without hash
      </button>
      <button
        id="with-hash"
        onClick={() => {
          const n = Number(Router.query.test || 0) + 1
          Router.replace(`/?test=${n}#hash`, window.location.pathname + '#hash')
        }}
      >
        replace with hash
      </button>
    </div>
  )
}

MyComponent.getInitialProps = async ({ query }) => {
  const isClient = typeof window !== 'undefined'
  if (isClient) {
    window.__gip = (window.__gip || []).concat(String(query.test))
  }
  return { query, where: isClient ? 'client' : 'server' }
}

export default MyComponent
