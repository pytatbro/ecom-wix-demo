"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "../formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

export default function LoginForm() {
  const { toast } = useToast();
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      // Assuming an async login function
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        description: "Failed to submit the form. Please try again.",
      });
    }
  }
  return (
    <>
      <Button variant="outline" className="w-full">
        Login with Google
      </Button>
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
          <Link
            href="/forgot-password"
            className="ml-auto text-sm font-normal text-black underline"
          >
            Forgot your password?
          </Link>
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>
      </Form>
    </>
  );
}
