'use server';

export async function fetchData() {
  return { timestamp: new Date().toISOString(), random: Math.random() };
}
