'use server';
import { getItems } from './data';

export async function loadMore(page) {
  return getItems(page);
}
