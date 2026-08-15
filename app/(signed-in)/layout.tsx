import { Suspense, type PropsWithChildren } from "react";

const SignedInLayout = ({ children }: PropsWithChildren) => {
  return <Suspense>{children}</Suspense>;
};

export default SignedInLayout;