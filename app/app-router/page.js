import Script from 'next/script'

export default function Page() {
  return (
    <main>
      <h1>app router inline next/script export repro</h1>
      <Script id="lime">
        {`document.body.style.backgroundColor = 'lime'`}
      </Script>
    </main>
  )
}
