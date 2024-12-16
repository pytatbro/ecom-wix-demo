export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100dvh-80px)] items-center space-y-14 px-5 py-10">
      <div className="basis-1/2">{children}</div>
      <div className="basis-1/2"></div>
    </main>
  );
}
