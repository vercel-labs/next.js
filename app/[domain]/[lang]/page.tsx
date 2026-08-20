import { FC } from 'react';

export const dynamic = 'force-static';

const Page: FC = () => {
    throw new Error('Test global error handling')
};

export default Page;