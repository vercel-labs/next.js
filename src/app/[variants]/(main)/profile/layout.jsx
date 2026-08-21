export default function ProfileLayout({ children }) {
  return (
    <div className='border-2 border-purple-500 p-4 rounded-lg w-full h-full'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Profile</h1>
      </div>
      {children}
    </div>
  );
}
