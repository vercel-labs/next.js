"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "components/ui/select";

import { testAction } from "./actions";

function FormContent() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 w-[300px] border rounded-lg p-3">
      <h2 className="font-bold">Form with Select</h2>
      <p className="text-neutral-500">
        This is a form with a shadcn/ui Select.
        <br />
        useFormStatus() pending{" "}
        <span className="text-red-600">does not work</span>
      </p>

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select element" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">One</SelectItem>
            <SelectItem value="2">Two</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button disabled={pending} type="submit">
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}

export default function DemoForm1() {
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
