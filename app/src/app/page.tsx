import { Counter } from './Counter';

async function incrementAction(n: number): Promise<number> {
  'use server';
  return n + 1;
}

export default async function Page() {
  return <Counter incrementAction={incrementAction} />;
}
