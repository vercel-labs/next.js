// Stand-in for gtag.js: marks when it starts executing and burns 300ms of main thread.
performance.mark('third-party-start')
const end = performance.now() + 300
while (performance.now() < end) {}
performance.mark('third-party-end')
window.__thirdPartyStart = performance.getEntriesByName('third-party-start')[0].startTime
window.__thirdPartyEnd = performance.getEntriesByName('third-party-end')[0].startTime
