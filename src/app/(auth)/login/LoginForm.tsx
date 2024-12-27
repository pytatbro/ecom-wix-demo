"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "../formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { env } from "@/env";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoadingButton from "@/components/LoadingButton";
import useLoginSuccess from "@/hooks/use-login-success";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { loginSuccess } = useLoginSuccess();
  const [resError, setResError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledDuringExternalAuth, setDisabledDuringExternalAuth] =
    useState(false);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      setLoading(true);
      setResError("");
      console.log(values);
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const res = await response.json();
      if (!response.ok) {
        setResError(res.error || "An unexpected error occurred.");
        toast({
          variant: "destructive",
          description:
            res.error || "An unexpected error occurred. Please try again.",
        });
        setLoading(false);
        if (res.errorCode === "verifyNeeded") {
          const token = crypto.randomUUID();
          if (Cookies.get(env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE)) {
            Cookies.remove(env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE);
          }
          Cookies.set(env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE, token, {
            expires: 3 / 288,
            secure: process.env.NODE_ENV === "production",
          });
          router.push(`/verification?token=${token}`);
        }
      } else {
        toast({
          description: "Login successful! Redirecting...",
        });
        await loginSuccess(res.sessionToken);
      }
    } catch (error) {
      console.error("Login error", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
      setLoading(false);
    }
  }
  return (
    <>
      <GoogleLoginButton
        returnErrorString={(error) => {
          setResError(error);
          toast({ variant: "destructive", description: error });
        }}
        returnSuccessString={(message) => toast({ description: message })}
        returnIsRunning={(isRunning) =>
          setDisabledDuringExternalAuth(isRunning)
        }
      />
      <div className="flex items-center gap-4">
        <Separator className="shrink bg-black" />
        <span className="text-base font-semibold">OR</span>
        <Separator className="shrink bg-black" />
      </div>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email" className="sr-only">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password" className="sr-only">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {resError !== "" && (
            <p className="text-sm font-medium text-destructive">{resError}</p>
          )}
          <Link
            href="/forgot-password"
            className="ml-auto text-sm font-normal underline"
          >
            Forgot your password?
          </Link>
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={disabledDuringExternalAuth}
            className="w-full"
          >
            Log in
          </LoadingButton>
        </form>
      </Form>
    </>
  );
}
