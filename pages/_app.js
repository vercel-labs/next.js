import App from 'next/app'
import { Wrapper } from 'router-wrapper'

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  )
}

MyApp.getInitialProps = async (appContext) => {
  return await App.getInitialProps(appContext)
}

export default MyApp
