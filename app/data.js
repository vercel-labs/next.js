export function getItems(page) {
  return Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i + 1,
    title: `Post ${page * 10 + i + 1}`,
  }));
}
