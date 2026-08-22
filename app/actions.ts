'use server';
import { state } from '../counter';

export async function bump() {
  state.counter += 100;
  return state.counter;
}
