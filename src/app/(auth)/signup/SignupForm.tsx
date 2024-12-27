"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { registerFormSchema } from "../formSchema";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { env } from "@/env";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useLoginSuccess from "@/hooks/use-login-success";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [resError, setResError] = useState("");
  const [resSuccess, setResSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useLoginSuccess();
  const [disabledDuringExternalAuth, setDisabledDuringExternalAuth] =
    useState(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setLoading(true);
      setResError("");
      console.log(values);
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
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
        if (res.messageCode === "ownerApprovalRequired") {
          setResSuccess(res.message);
          toast({
            description: res.message,
          });
        } else {
          toast({
            description: "Successful! Redirecting...",
          });
          await loginSuccess(res.sessionToken);
        }
      }
    } catch (error) {
      console.error("Sign up error", error);
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
        <Separator className="shrink bg-foreground" />
        <span className="text-base font-semibold">OR</span>
        <Separator className="shrink bg-foreground" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormControl>
                  <Input id="firstName" placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormControl>
                  <Input id="lastName" placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="johndoe@mail.com"
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="******"
                    autoComplete="new-password"
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
          {resSuccess !== "" && (
            <p className="text-sm font-medium text-green-700">{resSuccess}</p>
          )}
          <LoadingButton
            type="submit"
            loading={loading}
            disabled={disabledDuringExternalAuth}
            className="w-full"
          >
            Create account
          </LoadingButton>
        </form>
      </Form>
    </>
  );
}
