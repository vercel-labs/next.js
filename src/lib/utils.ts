type Falsy = "" | null | undefined;

export default function isStringNullable(x: string | Falsy): x is string & Falsy {
  return x === "" || x === undefined || x === null;
}
