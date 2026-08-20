'use server';

export async function getPost() {
  try {
    throw new Error('Email already exists', {
      cause: { status: 400, code: 'BA001' },
    });
  } catch (error) {
    throw error;
  }
}
