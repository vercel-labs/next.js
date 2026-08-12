export async function getMessages() {
  return (await import('../messages/en.json')).default
}
