import Link from 'next/link';

export default function VariantPage() {
  return (
    <div className='text-white p-4 border-2 border-blue-500 rounded-lg w-full h-full'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>VariantPage</h1>
      </div>
      <div className='flex flex-row gap-4'>
        <Link href='/dark/chat' className='text-blue-500'>
          Chat
        </Link>
      </div>
    </div>
  );
}
