import type { AppType } from 'next/app'
import { expectTypeOf } from 'expect-type'

// Regression test for https://github.com/vercel/next.js/issues/42846
//
// The type parameter of `AppType` describes the props returned by the App's own
// `getInitialProps`. At runtime those props are spread onto the App component's
// own props, not onto `pageProps`, so the types have to reflect that.
type MyInitialProps = { foo: string }

describe('AppType', () => {
  it("applies its type parameter to the App component's own props", () => {
    const MyApp: AppType<MyInitialProps> = (props) => {
      // `foo` is returned by `MyApp.getInitialProps` below and ends up on the
      // App's own props at runtime.
      expectTypeOf(props.foo).toEqualTypeOf<string>()
      expectTypeOf(props.Component).not.toBeNever()
      return null
    }

    MyApp.getInitialProps = async () => ({ foo: 'from-getInitialProps' })

    expect(typeof MyApp).toBe('function')
  })

  it('types the return value of getInitialProps with its type parameter', () => {
    type InitialProps = Awaited<
      ReturnType<NonNullable<AppType<MyInitialProps>['getInitialProps']>>
    >

    expectTypeOf<InitialProps>().toEqualTypeOf<MyInitialProps>()
  })
})
