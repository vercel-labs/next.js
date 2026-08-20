// stands in for any third-party widget bootstrap script
;(function () {
  window.__localWidgetExecutions = (window.__localWidgetExecutions || 0) + 1
  var el = document.getElementById('local-widget-root')
  if (el) el.innerHTML = '<p id="local-widget">local widget mounted</p>'
})()
