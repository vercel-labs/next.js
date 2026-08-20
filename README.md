# Repro: next/og ImageResponse "Expected <div> to have explicit display: flex"

Upstream issue: https://github.com/vercel/next.js/issues/48238

    npm install
    npm run dev
    curl -i http://localhost:3000/mixed    # 500, satori error
    curl -i http://localhost:3000/image2   # 500, reporter's original case
    curl -i http://localhost:3000/works    # 200 image/png

`/mixed` shows the real trigger: JSX `<div>{variable} guilds</div>` compiles to two
children (the variable and the literal " guilds"), so satori requires an explicit
`display: flex` / `display: none` on that div. `await`/`fetch` is irrelevant.
