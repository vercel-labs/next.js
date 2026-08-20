export default function Home() {
  return "Hello, world!";
}

// This function is never called
const example = () => {
  return false;

  // This code is inaccessible
  import("this-module-does-not-exist");
};
