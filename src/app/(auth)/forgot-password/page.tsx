"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

export default function ForgotPassForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPassFormSchema>>({
    resolver: zodResolver(forgotPassFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPassFormSchema>) {
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
    <div className="m-auto max-w-md space-y-6">
      <h1 className="text-center text-3xl font-bold lg:text-4xl">
        Forgot Password
      </h1>
      <p className="text-center">
        Enter your email address to receive a password reset link.
      </p>
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
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </div>
  );
}
