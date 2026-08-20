import { signIn } from "./actions";

export default function SignInPage() {
  // Note: this page intentionally does NOT read searchParams, so it stays static.
  return (
    <form action={signIn}>
      <input type="email" name="email" defaultValue="me@example.com" />
      <button type="submit">Sign in</button>
    </form>
  );
}
