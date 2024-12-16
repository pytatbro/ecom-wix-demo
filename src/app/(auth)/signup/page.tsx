import Link from "next/link";
import SignupForm from "./SignupForm";

export default function RegisterForm() {
  return (
    <div className="m-auto max-w-md space-y-6">
      <h1 className="text-center text-3xl font-bold lg:text-4xl">
        Create account
      </h1>
      <p className="text-center">
        Create a new account by filling out the form below.
      </p>
      <SignupForm />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
