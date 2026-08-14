'use server';

// A slow-ish Server Action, like an auth/session check in a provider.
export async function getAuth() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { isLoggedIn: true };
}
