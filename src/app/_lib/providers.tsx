"use client";

import { ReactNode, createContext } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TestProvider>
      <>
        {/* <TestCounterComponent /> */}
        {children}
      </>
    </TestProvider>
  );
}

// const TestCounterComponent = () => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         setCount(count + 1);
//     }, [count]);

//     return (
//         <div>
//             <h2>Count: {count}</h2>
//         </div>
//     );
// };

export interface TestProvider {}
const TestContext = createContext<TestProvider | null>(null);

const TestProvider = ({ children }: { children: ReactNode }) => {
  console.log("inside TestContext (local)");
  return <TestContext.Provider value={{}}>{children}</TestContext.Provider>;
};
