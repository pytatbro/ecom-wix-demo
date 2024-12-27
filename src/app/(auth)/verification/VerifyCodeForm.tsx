"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyCodeFormSchema } from "../formSchema";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { env } from "@/env";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import Cookies from "js-cookie";
import useLoginSuccess from "@/hooks/use-login-success";

export default function VerifyCodeForm() {
  const { toast } = useToast();
  const [resError, setResError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useLoginSuccess();

  const form = useForm<z.infer<typeof verifyCodeFormSchema>>({
    resolver: zodResolver(verifyCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof verifyCodeFormSchema>) {
    try {
      setLoading(true);
      setResError("");
      console.log(values);
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/auth/verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const res = await response.json();
      if (!response.ok) {
        setLoading(false);
        setResError(res.error || "An unexpected error occurred.");
        toast({
          variant: "destructive",
          description:
            res.error || "Failed to verify the code. Please try again.",
        });
      } else {
        Cookies.remove(env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE);
        toast({
          description: "Verification successful! Redirecting...",
        });
        await loginSuccess(res.sessionToken);
      }
    } catch (error) {
      console.error("Verification error", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-7">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="mx-auto w-fit">
              <FormLabel className="sr-only">Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {resError !== "" && (
          <p className="text-sm font-medium text-destructive">{resError}</p>
        )}
        <LoadingButton type="submit" loading={loading} className="w-full">
          Verify
        </LoadingButton>
      </form>
    </Form>
  );
}
