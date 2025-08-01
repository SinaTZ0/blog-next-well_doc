// ================================================================================================
// FILE: @/app/auth/components/SignupForm.tsx
// ================================================================================================
// PURPOSE: Renders the Sign Up form using Shadcn UI components, React Hook  Form for state
//          management, and Zod for validation. Includes password confirmation. Designed for
//          Next.js App Router, React 19+, and Tailwind CSS v4.
/**================================================================================================
 *                                         Imports
 *================================================================================================**/
// Mark this component as a Client Component
"use client";

import * as React from "react"; // Using React 19 features implicitly
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Only need content/footer structure
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Import Better-Auth client
import { authClient } from "@/lib/better-auth/auth-client";

// Import type-fest utils
import type { IsEqual } from "type-fest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import Motion
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
/**================================================================================================
 *                                         Validation Schema and Type
 *================================================================================================**/
// Infer TypeScript type from Better-Auth
type SignUpEmailData = Omit<Parameters<typeof authClient.signUp.email>[0], "fetchOptions" | "callbackURL">;

// Schema for the Sign Up form
const signupSchema = z
  .object({
    name: z.string().min(1, { message: "نام لازم می‌باشد." }),
    email: z.string().email({ message: "آدرس ایمیل نامعتبر است." }),
    password: z.string().min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
    image: z.string().optional(),
    confirmPassword: z.string().min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
  })
  // Add a refinement to check if passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمزهای عبور مطابقت ندارند.",
    path: ["confirmPassword"], // Set the error path to confirmPassword field
  });
// Infer TypeScript type from the Zod schema
type SignupFormValues = z.infer<typeof signupSchema>;

// This will fail at compile time if the form values (minus confirmPassword) don't match the auth API requirements
type AssertEqual<A, B> = IsEqual<A, B> extends true ? true : never;
const _test: AssertEqual<SignUpEmailData, Omit<SignupFormValues, "confirmPassword">> = true;

/**=======================================================================================================================
 *                                                    Animated Error Message Component
 *=======================================================================================================================**/
export const AnimatedFormMessage: React.FC<{ message: string | undefined }> = ({ message }) => {
  /**------------------------------------------------------------------------------------------------
   *                                         Animaiton Values
   *------------------------------------------------------------------------------------------------**/
  const messageVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2 },
  };
  const messageVariants2 = {
    initial: { opacity: 0, marginTop: -20 },
    animate: { opacity: 1, marginTop: 0 },
    exit: { opacity: 0, marginTop: -20 },
    transition: { duration: 0.2 },
  };
  /**------------------------------------------------------------------------------------------------
   *                                         Render Logic
   *------------------------------------------------------------------------------------------------**/
  return (
    <div className="overflow-hidden">
      <AnimatePresence>
        {message ? (
          <m.div
            initial={{ opacity: 0, marginTop: -20 }}
            animate={{ opacity: 1, marginTop: 0 }}
            exit={{ opacity: 0, marginTop: -20 }}
            transition={{ duration: 0.2 }}
            className="text-red-400 text-sm"
          >
            {message}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
/**=======================================================================================================================
 *                                                    SignupForm Component
 *=======================================================================================================================**/
export const SignupForm = () => {
  /**------------------------------------------------------------------------------------------------
   *                                             Form Initialization
   *                              Initialize react-hook-form for the Sign Up form
   *------------------------------------------------------------------------------------------------**/
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema), // Use Zod for validation
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**------------------------------------------------------------------------------------------------
   *                                              Submission Handler
   *                                     Handler for Sign Up form submission
   *------------------------------------------------------------------------------------------------**/
  /*-------------------------------- Init Router ------------------------------*/
  const router = useRouter();
  /*-------------------------------- Function ------------------------------*/
  const onSubmit = async (values: SignupFormValues) => {
    const { confirmPassword, ...signupData } = values;
    const { data, error } = await authClient.signUp.email(
      {
        email: signupData.email, // user email address
        password: signupData.password, // user password -> min 8 characters by default
        name: signupData.name, // user display name
      },
      {
        onSuccess: (ctx) => {
          toast.success("حساب کاربری شما با موفقیت ساخته شد", {
            description: new Intl.DateTimeFormat("fa-IR", {
              dateStyle: "full",
              timeStyle: "long",
            }).format(new Date()),
          });
          router.push("/secret");
        },
        onError: (ctx) => {
          console.dir("Sign-up error:", ctx); // Log the error for debugging
          // display the error message
          toast.error("خطا در ایجاد حساب کاربری", {
            description: ctx.error.message ?? "لطفا برای رفع مشکل با ادمین تماس بگیرید.",
          });
        },
      }
    );
  };

  /**------------------------------------------------------------------------------------------------
   *                                             Render Logic
   *------------------------------------------------------------------------------------------------**/
  return (
    <Card>
      {/* <CardHeader className="bg-red-400"> */}
      <CardHeader>
        <CardTitle>ایجاد حساب کاربری</CardTitle>
        <CardDescription className="font-light text-justify">
          یک حساب کاربری جدید ایجاد کنید. یک رمز عبور قوی انتخاب کنید.
        </CardDescription>
      </CardHeader>
      {/* Form integrates with react-hook-form */}
      <Form {...form}>
        {/*
        The actual <form> element.
        We use form.handleSubmit to wrap our onSubmit function.
        The `id` allows the button outside the <form> tag (in CardFooter) to trigger submission.
      */}
        <form onSubmit={form.handleSubmit(onSubmit)} id="signup-form" className="space-y-0">
          {/* CardContent provides padding and spacing for form fields */}
          <CardContent className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام‌خانوادگی</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="سینا تفنگ ساز"
                      type="text"
                      autoComplete="name"
                      {...field} // Spread field props
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <AnimatedFormMessage message={form.formState.errors[field.name]?.message} />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      autoComplete="email"
                      {...field} // Spread field props
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <AnimatedFormMessage message={form.formState.errors[field.name]?.message} />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      autoComplete="new-password" // Hint for password managers
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <AnimatedFormMessage message={form.formState.errors[field.name]?.message} />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تایید رمز عبور</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  {/* <FormMessage /> */}
                  <AnimatedFormMessage message={form.formState.errors[field.name]?.message} />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
      {/* CardFooter contains the submission button */}
      <CardFooter>
        <Button
          form="signup-form" // Associate button with the form using the form's id
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting} // Disable button during submission
        >
          {/* Show different text based on submission state */}
          {form.formState.isSubmitting ? "در حال ایجاد حساب..." : "ایجاد حساب"}
        </Button>
      </CardFooter>
    </Card>
  );
};
