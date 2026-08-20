import type { AppType } from 'next/app'

interface MyInitialProps {
  foo: string
}

// AppType<MyInitialProps> should describe an App whose getInitialProps returns
// MyInitialProps, so `foo` is spread onto the App component's own props.
const MyApp: AppType<MyInitialProps> = (props) => {
  return (
    <>
      {/* ERROR: Property 'foo' does not exist on type 'AppPropsType<any, MyInitialProps>' */}
      <p id="own">props.foo = {JSON.stringify(props.foo)}</p>
      {/* NO ERROR, but undefined at runtime */}
      <p id="page">props.pageProps.foo = {JSON.stringify((props.pageProps as any)?.foo)}</p>
      <props.Component {...(props.pageProps as any)} />
    </>
  )
}

MyApp.getInitialProps = async () => {
  return { foo: 'from-getInitialProps' }
}

export default MyApp
