// Emulates a synchronous A/B-testing script (e.g. Convert/Optimize):
// 1) mutates <head> while the document is parsed
// 2) rewrites page content before React hydration, so the DOM no longer
//    matches the server-rendered HTML.
;(function () {
  var style = document.createElement('style')
  style.setAttribute('data-ab-tool', 'true')
  style.textContent = '.ab-variant #headline { color: rebeccapurple }'
  document.head.appendChild(style)
  document.documentElement.classList.add('ab-variant')

  // Apply the "variant" as soon as the target element exists, i.e. before
  // React hydration runs.
  var mo = new MutationObserver(function () {
    var h = document.getElementById('headline')
    if (h) {
      h.textContent = 'Rewritten headline (variant B)'
      var banner = document.createElement('div')
      banner.id = 'ab-banner'
      banner.textContent = 'injected by third-party script'
      document.body.insertBefore(banner, document.body.firstChild)
      mo.disconnect()
    }
  })
  mo.observe(document.documentElement, { childList: true, subtree: true })
})()
