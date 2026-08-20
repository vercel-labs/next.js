# Repro: nextUrl.basePath empty in middleware for non-default locale (next#49883)

    npm install
    npm run dev
    curl http://localhost:3000/home/en
    curl http://localhost:3000/home/fr

Terminal output shows `basePath="/home"` and `pathname="/"` for the default
locale, but `basePath=""` and `pathname="/home/fr"` (basePath left in the
pathname) for `fr`.
