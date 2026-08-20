"use client";

import { formUserSchema } from "../model";

export function Form() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(formUserSchema.safeParse({ name: data.get("name") }));
      }}
    >
      <input name="name" />
      <button type="submit">submit</button>
    </form>
  );
}
