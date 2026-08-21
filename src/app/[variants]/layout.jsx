export default function VariantLayout({ children, modal }) {
  return (
    <div className='w-full h-full min-h-screen border-2 border-red-500 p-4'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Variant</h1>
      </div>
      {children}
      {modal}
      <div id='modal-root'></div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
