import { ClientComponent } from "./client-component";

export default function Page() {
  const plainObject = { foo: "bar" };
  const objectWithNullPrototype = Object.create(null);
  objectWithNullPrototype.foo = "bar";
  return (
    <main>
      <ClientComponent myObject={plainObject} />
      <ClientComponent myObject={objectWithNullPrototype} />
    </main>
  );
}
