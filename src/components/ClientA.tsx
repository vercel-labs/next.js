'use client';
console.log('MODULE ClientA evaluated');
export default function ClientA() {
  console.log('ClientA rendered');
  return <div id="A">CLIENT A</div>;
}
