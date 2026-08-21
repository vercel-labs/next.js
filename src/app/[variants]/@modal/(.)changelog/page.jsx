import Link from 'next/link';

export default function ChangelogModalPage() {
  return (
    <div className='border-2 border-purple-500 p-4 rounded-lg w-full h-full'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Changelog Modal Page</h1>
      </div>
      <div className='mb-4 border-2 border-yellow-500 p-4 rounded-lg w-full h-full flex flex-col gap-4'>
        <Link href='/dark/profile' className='text-blue-500 w-full' replace>
          Profile
        </Link>
        <Link href='/dark/setting' className='text-blue-500 w-full' replace>
          Setting
        </Link>
      </div>
    </div>
  );
}
