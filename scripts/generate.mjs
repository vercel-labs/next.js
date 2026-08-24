import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const repositoryRoot = new URL("../", import.meta.url);
const appDirectory = new URL("app/", repositoryRoot);
const generatedDirectory = new URL("generated/", repositoryRoot);

const readPositiveInteger = (name, fallback) => {
  const value = Number.parseInt(process.env[name] ?? String(fallback), 10);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
};

const routeCount = readPositiveInteger("REPRO_ROUTES", 100);
const componentsPerRoute = readPositiveInteger("REPRO_COMPONENTS_PER_ROUTE", 120);
const rowsPerComponent = readPositiveInteger("REPRO_ROWS_PER_COMPONENT", 96);

const existingAppEntries = await readdir(appDirectory, { withFileTypes: true });
await Promise.all(
  existingAppEntries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("repro-"))
    .map((entry) => rm(join(appDirectory.pathname, entry.name), { recursive: true })),
);
await rm(generatedDirectory, { force: true, recursive: true });

const componentDirectory = new URL("components/", generatedDirectory);
const bundleDirectory = new URL("bundles/", generatedDirectory);
await Promise.all([
  mkdir(componentDirectory, { recursive: true }),
  mkdir(bundleDirectory, { recursive: true }),
]);

const componentSource = (routeIndex, componentIndex) => {
  const componentName = `Component${routeIndex}_${componentIndex}`;
  const rows = Array.from({ length: rowsPerComponent }, (_, rowIndex) => {
    const id = `${routeIndex}-${componentIndex}-${rowIndex}`;
    return `  { id: "${id}", label: "Synthetic row ${id}", value: ${routeIndex + componentIndex + rowIndex} },`;
  }).join("\n");

  return `"use client";

import { useMemo } from "react";

const rows = [
${rows}
] as const;

export function ${componentName}({ seed }: { seed: number }) {
  const visibleRows = useMemo(
    () => rows.map((row, index) => ({ ...row, score: row.value + seed + index })),
    [seed],
  );

  return (
    <section aria-label="${componentName}">
      {visibleRows.map((row) => (
        <span data-score={row.score} key={row.id}>{row.label}</span>
      ))}
    </section>
  );
}
`;
};

for (let routeIndex = 0; routeIndex < routeCount; routeIndex += 1) {
  const componentWrites = [];
  const imports = [];
  const elements = [];

  for (
    let componentIndex = 0;
    componentIndex < componentsPerRoute;
    componentIndex += 1
  ) {
    const componentName = `Component${routeIndex}_${componentIndex}`;
    const relativePath = `route-${routeIndex}-component-${componentIndex}`;
    imports.push(
      `import { ${componentName} } from "@/generated/components/${relativePath}";`,
    );
    elements.push(`      <${componentName} seed={${routeIndex + componentIndex}} />`);
    componentWrites.push(
      writeFile(
        new URL(`${relativePath}.tsx`, componentDirectory),
        componentSource(routeIndex, componentIndex),
      ),
    );
  }

  const bundleName = `Route${routeIndex}Client`;
  componentWrites.push(
    writeFile(
      new URL(`route-${routeIndex}.tsx`, bundleDirectory),
      `"use client";

${imports.join("\n")}

export function ${bundleName}() {
  return (
    <main>
${elements.join("\n")}
    </main>
  );
}
`,
    ),
  );

  const routeDirectory = new URL(`repro-${routeIndex}/`, appDirectory);
  await mkdir(routeDirectory, { recursive: true });
  componentWrites.push(
    writeFile(
      new URL("page.tsx", routeDirectory),
      `import { ${bundleName} } from "@/generated/bundles/route-${routeIndex}";

export const dynamic = "force-dynamic";

export default function Page() {
  return <${bundleName} />;
}
`,
    ),
  );
  await Promise.all(componentWrites);
}

console.log(
  `Generated ${routeCount} routes and ${routeCount * componentsPerRoute} client components (${rowsPerComponent} rows each).`,
);
