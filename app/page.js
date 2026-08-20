"use client";
import { useActionState } from "react";
import { unboundAction, boundAction } from "./actions";

export default function Page() {
  const [, unbound] = useActionState(unboundAction, {});
  const [, bound] = useActionState(boundAction.bind(null, "bound-argument-value"), {});
  return (
    <>
      <form action={unbound} id="unbound">
        <input name="hello" defaultValue="world" />
        <button type="submit">works: useActionState, unbound action</button>
      </form>
      <form action={bound} id="bound">
        <input name="hello" defaultValue="world" />
        <button type="submit">hangs: useActionState, .bind()-ed action</button>
      </form>
    </>
  );
}
