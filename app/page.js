"use client";

import { useReducer, useState } from "react";

// Mimics exactly what the Google Translate widget does to the DOM:
// it replaces bare text nodes with <font> elements containing the
// translated text. React still holds a reference to the original
// text node, so the next reconciliation of that node throws.
function fakeGoogleTranslate(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    if (!node.nodeValue.trim()) continue;
    const font = document.createElement("font");
    font.setAttribute("style", "vertical-align: inherit;");
    font.appendChild(document.createTextNode("[translated] " + node.nodeValue));
    node.parentNode.replaceChild(font, node);
  }
}

export default function Page() {
  const [open, toggle] = useReducer((x) => !x, false);
  const [translated, setTranslated] = useState(false);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Next.js #66739 - crash after (Google) translation</h1>

      <button
        id="translate"
        onClick={() => {
          fakeGoogleTranslate(document.getElementById("dropdown-host"));
          setTranslated(true);
        }}
      >
        1. Translate page (simulates the Google Translate DOM rewrite)
      </button>

      <p>translated: {String(translated)}</p>

      <div id="dropdown-host">
        <button id="toggle" onClick={toggle}>
          2. Toggle dropdown
        </button>
        {/* floating text node - no wrapping element */}
        {open && <>tomato</>}
        {!open && <>potato</>}
      </div>
    </main>
  );
}
