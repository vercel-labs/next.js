// Repro: Turbopack panic in next-code-frame when a code frame is rendered.
import missing from './does-not-exist';
export const s = `template start
second line
세번째줄한글로아주길게이어지는문자열이며바이트경계를넘도록충분히길게작성한줄입니다여기까지계속이어집니다끝
`;
export default function Page() { return <pre>{String(missing)}{s}</pre>; }
