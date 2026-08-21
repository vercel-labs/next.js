'use client';
console.log('MODULE ClientB evaluated');
export default function ClientB() {
  console.log('ClientB rendered');
  return <div id="B">CLIENT B</div>;
}
