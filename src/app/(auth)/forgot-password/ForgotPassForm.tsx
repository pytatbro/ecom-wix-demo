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
import { Input } from "@/components/ui/input";
import { forgotPassFormSchema } from "../formSchema";
import { useState } from "react";
import { env } from "@/env";
import LoadingButton from "@/components/LoadingButton";

export default function ForgotPassForm() {
  const { toast } = useToast();
  const [resError, setResError] = useState("");
  const [resSuccess, setResSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPassFormSchema>>({
    resolver: zodResolver(forgotPassFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPassFormSchema>) {
    try {
      setLoading(true);
      setResError("");
      console.log(values);
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
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
            res.error ||
            "Error sending password reset email. Please try again.",
        });
      } else {
        setResSuccess(res.message);
        toast({
          description: res.message,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Reset password error", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
        {resError !== "" && (
          <p className="text-sm font-medium text-destructive">{resError}</p>
        )}
        {resSuccess !== "" && (
          <p className="text-sm font-medium text-green-700">{resSuccess}</p>
        )}
        <LoadingButton type="submit" loading={loading} className="w-full">
          Send Reset Link
        </LoadingButton>
      </form>
    </Form>
  );
}
