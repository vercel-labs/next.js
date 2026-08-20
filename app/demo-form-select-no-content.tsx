"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "components/ui/button";
import { Select, SelectTrigger, SelectValue } from "components/ui/select";
import { testAction } from "./actions";

function FormContent() {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-col gap-3 w-[300px] border rounded-lg p-3">
      <h2 className="font-bold">Radix Select trigger only</h2>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select element" />
        </SelectTrigger>
      </Select>
      <Button disabled={pending} type="submit">
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}

export default function DemoFormSelectNoContent() {
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
