import dynamic from 'next/dynamic'

const LazyPage = dynamic(() => import('./Page'))

export default LazyPage
