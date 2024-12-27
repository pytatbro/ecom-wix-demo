import { env } from "@/env";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";
import authImg from "@/assets/store-street.webp";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_OAUTH_CLIENT_ID}>
      <main className="h-[822px] 2xl:h-[calc(100dvh-80px)]">
        <div className="flex h-full items-center justify-center">
          <div className="py-10 lg:w-1/2">{children}</div>
          <div className="relative hidden h-full lg:block lg:w-1/2">
            <Image
              src={authImg}
              alt="Two people walking in the street"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
