"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

import { testAction } from "./actions";

function FormContent() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 w-[300px] border rounded-lg p-3">
      <h2 className="font-bold">Form with Input</h2>
      <p className="text-neutral-500">
        This is a form with a shadcn/ui Input
        <br />
        useFormStatus() pending <span className="text-green-600">works</span>
      </p>
      <Input placeholder="Input element" />

      <Button disabled={pending} type="submit">
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}

export default function DemoForm() {
  const [state, formAction] = useActionState(testAction, null);

  return (
    <div className="p-8">
      <form action={formAction}>
        <FormContent />
      </form>
      <pre>state: {state?.randomNumber && <>{state.randomNumber}</>}</pre>
    </div>
  );
}
