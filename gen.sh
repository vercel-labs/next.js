#!/bin/bash
# generate synthetic routes into $1/src/app
set -e
app="$1"
rm -rf "$app/src/app/r"
mkdir -p "$app/src/components"
for c in $(seq 1 40); do
cat > "$app/src/components/C$c.tsx" <<EOT
"use client";
import { useState } from "react";
export default function C$c({ n = $c }: { n?: number }) {
  const [v, setV] = useState(n);
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 sm:p-8 md:grid md:grid-cols-3">
      <button onClick={() => setV(v + 1)} className="px-3 py-1 rounded bg-blue-500 text-white">c$c {v}</button>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className="text-sm/6 tracking-tight text-gray-700">item-$c-{i}</span>
      ))}
    </div>
  );
}
EOT
done
for p in $(seq 1 40); do
  mkdir -p "$app/src/app/r/p$p"
  {
    echo 'import Image from "next/image";'
    for c in $(seq 1 40); do echo "import C$c from \"@/components/C$c\";"; done
    echo "export default function P$p() { return (<main className=\"p-8 grid gap-4\"><Image src=\"/next.svg\" alt=\"l\" width={90} height={20} />"
    for c in $(seq 1 40); do echo "<C$c n={$c} />"; done
    echo "</main>); }"
  } > "$app/src/app/r/p$p/page.tsx"
done
