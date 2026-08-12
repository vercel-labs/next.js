const entries = Object.entries(process.env).filter(([key, value]) =>
  `${key}${value}`.includes("\0"),
);

if (entries.length === 0) {
  console.log("No environment variables containing NUL bytes were found.");
  process.exit(0);
}

console.log("Environment variables containing NUL bytes:");

for (const [key, value] of entries) {
  console.log(`- ${key} = ${JSON.stringify(value)}`);
}
