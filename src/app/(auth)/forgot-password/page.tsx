import Link from "next/link";
import ForgotPassForm from "./ForgotPassForm";

export default function ForgotPassPage() {
  return (
    <div className="m-auto max-w-md space-y-6">
      <h1 className="text-center text-3xl font-bold lg:text-4xl">
        Forgot Password
      </h1>
      <p className="text-center">
        Enter your email address to receive a password reset link.
      </p>
      <ForgotPassForm />
      <p className="text-center">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
