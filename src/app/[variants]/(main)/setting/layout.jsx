export default function SettingLayout({ children }) {
  return (
    <div className='border-2 border-purple-500 p-4 rounded-lg w-full h-full'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Setting</h1>
      </div>
      {children}
    </div>
  );
}
