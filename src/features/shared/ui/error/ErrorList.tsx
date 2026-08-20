'use client';

import { useFormStatus } from 'react-dom';
import { ClassNamePropsOptional } from '@/features/shared/ui/ClassNameProps';

interface ErrorListProps extends ClassNamePropsOptional {
  readonly errors: {errorMsg: string}[];
}

export const ErrorList = ({ className, errors }: ErrorListProps) => {
  const { pending } = useFormStatus();
  if (pending || !errors || errors.length < 1) return null;

  return (
    <div className={className}>
      {errors.map((error) => (
        <p key={error.errorMsg} className="text-sm mb-2 text-red-600">
          {error.errorMsg}
        </p>
      ))}
    </div>
  );
};
