import Modal from '../modal';

export default function ChangelogModalLayout({ children }) {
  return (
    <Modal>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Changelog Modal</h1>
      </div>
      {children}
    </Modal>
  );
}

export const revalidate = 0;

export const dynamic = 'force-dynamic';
