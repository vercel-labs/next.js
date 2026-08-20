# Pages Router: `CacheHandler.revalidateTag` is never called (docs issue #65736)

```
npm install
npm run build
npm start
# other shell
curl localhost:3000/
curl localhost:3000/api/revalidate
```

On-demand revalidation via `res.revalidate('/')` only triggers
`get` -> `getStaticProps` -> `set`. `revalidateTag` is never invoked, and `set`
receives no `tags` in the Pages Router, unlike the shared docs example at
https://nextjs.org/docs/pages/building-your-application/deploying#caching-and-isr
