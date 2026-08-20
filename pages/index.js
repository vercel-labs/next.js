import { Suspense, useCallback, useRef } from "react";

const wrapPromiseState = (promise) => {
  let status = "pending";
  let result = null;
  const suspender = promise.then(
    (r) => { status = "success"; result = r; },
    (e) => { status = "error"; result = e; }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
};

// Reporter's hook: the promise wrapper is cached in a useRef
const useModuleImportSuspense = (modules) => {
  const ref = useRef(null);
  if (!ref.current) ref.current = wrapPromiseState(Promise.all(modules()));
  return ref.current.read();
};

let renders = 0;

const TestComponent = () => {
  const stateCheck = useRef(false);
  renders++;
  console.log("HELLO THERE --->", stateCheck.current, "(render #" + renders + ")");
  if (renders > 200) throw new Error("STOP: infinite suspend loop, ref never preserved after 200 renders");
  if (!stateCheck.current) stateCheck.current = true;

  const callback = useCallback(
    () => [new Promise((resolve) => resolve({ Test: () => "Test" }))],
    []
  );
  const [state] = useModuleImportSuspense(callback);
  return <div>Test {state.Test()}</div>;
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestComponent />
    </Suspense>
  );
}
