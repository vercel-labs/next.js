// Mimics ajv's codegen/scope.js: reserved words used as unquoted object keys.
export const varKinds = { const: "const", let: "let", var: "var" };
export const memberExpr = varKinds.var + varKinds.const + varKinds.let;
