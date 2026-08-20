"use client";

import { useReportWebVitals } from "next/web-vitals";

export function Analytics() {
  useReportWebVitals((metric) => {
    // `metric` should be typed as `Metric` from web-vitals, but resolves to `any`
    // because next/dist/compiled/web-vitals ships no .d.ts file.
    // Proof 1: assigning `metric.name` (should be a string union) to a number does not error.
    const bogus: number = metric.name;

    // Proof 2: an arbitrary property access does not error either.
    console.log(metric.thisPropertyDoesNotExistOnMetric, bogus);
  });

  return null;
}
