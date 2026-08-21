export default function Loading() {
  // padded > 1024 bytes so streaming is not buffered by the browser
  return <div>TEST LOADING …{' '}{'.'.repeat(2000)}</div>;
}
