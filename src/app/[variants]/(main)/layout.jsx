import Link from 'next/link';

export default function MainLayout({ children, modal }) {
  return (
    <div className='border-2 border-blue-500 p-4 rounded-lg w-full h-full'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Main</h1>
      </div>
      <div className='mb-4 border-2 border-yellow-500 p-4 rounded-lg w-full h-full flex flex-row gap-4'>
        <div className='border-2 border-green-500 p-4 rounded-lg h-full min-w-64 flex flex-col gap-4 '>
          <Link href='/dark/profile' className='text-blue-500 w-full'>
            Profile
          </Link>
          <Link href='/dark/setting' className='text-blue-500 w-full'>
            Setting
          </Link>
          <Link href='/dark/chat' className='text-blue-500 w-full'>
            Chat
          </Link>
          <Link href='/dark/discover' className='text-blue-500 w-full'>
            Discover
          </Link>
          <Link href='/dark/changelog' className='text-blue-500 w-full'>
            Changelog
          </Link>
        </div>
        <div className='w-full h-full flex-1'>{children}</div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export const revalidate = 0;
