import { tracer } from "dd-trace";

export const onRequestError = (error: unknown) => {
  const span = tracer.scope().active();

  if (span) {
    span.setTag("error", error);
  }
};
