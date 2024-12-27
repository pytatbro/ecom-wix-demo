import VerifyCodeForm from "./VerifyCodeForm";

export default function VerificationPage() {
  return (
    <div className="m-auto max-w-md space-y-6">
      <h1 className="text-center text-3xl font-bold lg:text-4xl">
        Verification Required
      </h1>
      <p className="text-center">
        Please enter the 6-character code we&apos;ve sent to your email.
      </p>
      <VerifyCodeForm />
      <p className="text-center">Didn&apos;t get the email? Check your spam.</p>
    </div>
  );
}
