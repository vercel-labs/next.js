import _ from "lodash";
import * as dateFns from "date-fns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export default function App({ Component, pageProps }) {
  // reference the heavy deps so they are bundled into the _app chunk
  const marker = _.chunk([1, 2, 3], 2).length + Object.keys(dateFns).length;
  return (
    <QueryClientProvider client={qc}>
      <div data-marker={marker}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
