"use client"
export const i18nTokens = ["foobar"]
export function ClientComponent({ translations }: { translations: Array<[string, string]> }) {
    return <span>Show translated content for key "foo": {translations.find(([k, v]) => k === "foo")?.[1]}</span>
}