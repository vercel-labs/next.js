'use server';

export async function throwingAction() {
  throw new Error('boom from server action');
}
