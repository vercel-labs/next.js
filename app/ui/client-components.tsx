"use client";

import { createItem, deleteItem } from "../lib/actions";

export function AddItemClient() {
  return (
    <form action={createItem}>
      <button id="add" type="submit">Add Item (Client Component)</button>
    </form>
  );
}

export function RemoveItemClient() {
  return (
    <form action={deleteItem}>
      <button id="remove" type="submit">Remove Item (Client Component)</button>
    </form>
  );
}
