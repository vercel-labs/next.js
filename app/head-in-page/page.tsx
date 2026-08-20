// Workaround from the issue: render a <head> element inside the page.
export default function Page() {
  return (
    <>
      <head>
        <meta httpEquiv="refresh" content={'5; URL="/target"'} />
      </head>
      <p>head-in-page workaround</p>
    </>
  )
}
