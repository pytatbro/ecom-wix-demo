import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(3, "Email must be at least 3 characters.")
  .email("Please type a valid email.");
const password = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: "Password must contain lowercase, uppercase, and number.",
  });

const loginFormSchema = z.object({
  email: email,
  password: password,
});

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: email,
    password: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const forgotPassFormSchema = z.object({
  email: email,
});

export { loginFormSchema, registerFormSchema, forgotPassFormSchema };
