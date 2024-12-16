import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="m-auto max-w-md space-y-6">
      <h1 className="text-center text-3xl font-bold lg:text-4xl">Log in</h1>
      <p className="text-center">Please enter your details to sign in.</p>
      <LoginForm />
      <p className="text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up now
        </Link>
      </p>
    </div>
  );
}
