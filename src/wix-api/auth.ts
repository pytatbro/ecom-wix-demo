import { env } from "@/env";
import { WixClient } from "@/lib/wix-client.base";
import { authentication } from "@wix/identity";
import { StateMachine } from "@wix/sdk";

interface wixLoginValues {
  email: string;
  password: string;
}

interface wixSignUpValues {
  email: string;
  password: string;
  profile: authentication.IdentityProfile;
}

export async function wixLogin(
  wixClient: WixClient,
  { email, password }: wixLoginValues,
) {
  const response = await wixClient.auth.login({
    email: email,
    password: password,
  });
  return response;
}

export async function wixSignUp(
  wixClient: WixClient,
  { email, password, profile }: wixSignUpValues,
) {
  const response = await wixClient.auth.register({
    email: email,
    password: password,
    profile: profile,
  });
  return response;
}

export async function wixLogOut(wixClient: WixClient) {
  const { logoutUrl } = await wixClient.auth.logout(env.NEXT_PUBLIC_BASE_URL);
  return logoutUrl;
}

export async function wixEmailVerify(
  wixClient: WixClient,
  verificationCode: string,
  stateMachine: StateMachine,
) {
  const response = await wixClient.auth.processVerification(
    {
      verificationCode: verificationCode,
    },
    stateMachine,
  );
  return response;
}
