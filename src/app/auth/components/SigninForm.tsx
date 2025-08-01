// ================================================================================================
// FILE: @/app/auth/components/SigninForm.tsx
// ================================================================================================
// PURPOSE: Renders the Sign In form using Shadcn UI components, React Hook Form for state
//          management, and Zod for validation. Designed for Next.js App Router, React 19+,
//          and Tailwind CSS v4.
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Only need content/footer structure here
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Import Better-Auth client
import { authClient } from "@/lib/better-auth/auth-client";

// Import type-fest utils and toast
import type { IsEqual } from "type-fest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AnimatedFormMessage from "./anime";
import { useTransitionState } from "react-transition-state";
import AnimatedErrorMessage from "./anime";
import AnimatePresence from "./anime";

/**================================================================================================
 *                                         Validation Schema and Type
 *================================================================================================**/

// Schema for the Sign In form
const signinSchema = z.object({
  email: z.string().email({ message: "آدرس ایمیل نامعتبر است." }),
  password: z.string().min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." }),
  rememberMe: z.boolean().optional(), // Add rememberMe field
});

// Infer TypeScript type from the Zod schema
type SigninFormValues = z.infer<typeof signinSchema>;

// Infer TypeScript type from Better-Auth for sign-in
type SignInEmailData = Omit<Parameters<typeof authClient.signIn.email>[0], "fetchOptions" | "callbackURL">;

// This will fail at compile time if the form values don't match the auth API requirements
type AssertEqual<A, B> = IsEqual<A, B> extends true ? true : never;
const _test_formSchema_with_betterAuth_inputs: AssertEqual<SignInEmailData, SigninFormValues> = true;

/**=======================================================================================================================
 *                                                    SigninForm Component
 *=======================================================================================================================**/
export function SigninForm() {
  /**------------------------------------------------------------------------------------------------
   *                                             Form Initialization
   *                              Initialize react-hook-form for the Sign In form
   *------------------------------------------------------------------------------------------------**/
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema), // Use Zod for validation
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true, // Default rememberMe to false
    },
  });

  /**------------------------------------------------------------------------------------------------
   *                                              Submission Handler
   *                                     Handler for Sign In form submission
   *------------------------------------------------------------------------------------------------**/
  /*-------------------------------- Init Router ------------------------------*/
  const router = useRouter();
  /*-------------------------------- Function ------------------------------*/
  async function onSubmit(values: SigninFormValues) {
    // Call the Better-Auth client function for email sign-in
    const { data, error } = await authClient.signIn.email(
      {
        email: values.email, // User's email
        password: values.password, // User's password
        rememberMe: values.rememberMe, // Pass rememberMe value
      },
      {
        // Callback for successful sign-in
        onSuccess: (ctx) => {
          toast.success("ورود با موفقیت انجام شد", {
            description: new Intl.DateTimeFormat("fa-IR", {
              dateStyle: "full",
              timeStyle: "long",
            }).format(new Date()),
          });
          router.push("/secret");
        },
        // Callback for sign-in errors
        onError: (ctx) => {
          console.dir("Sign-in error:", ctx); // Log the error for debugging
          // Display a user-friendly error message
          toast.error("خطا در ورود به حساب", {
            description: ctx.error.message ?? "ایمیل یا رمز عبور نامعتبر است. لطفا دوباره تلاش کنید.",
          });
        },
      }
    );
  }
  //******************************************************** */
  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 500,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });
  /**------------------------------------------------------------------------------------------------
   *                                             Render Logic
   *------------------------------------------------------------------------------------------------**/
  return (
    <Card>
      <CardHeader>
        <CardTitle>ورود به حساب</CardTitle>
        <CardDescription className="font-light text-justify">
          با استفاده از ایمیل و رمز عبور خود به حساب کاربری خود دسترسی پیدا کنید.
        </CardDescription>
      </CardHeader>
      {/* Form integrates with react-hook-form */}
      <Form {...form}>
        {/*`
        The actual <form> element.
        We use form.handleSubmit to wrap our onSubmit function.
        The `id` allows the button outside the <form> tag (in CardFooter) to trigger submission.
      */}
        <form onSubmit={form.handleSubmit(onSubmit)} id="signin-form">
          {/* CardContent provides padding and spacing for form fields */}
          <CardContent className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        autoComplete="email" // Improve accessibility and user experience
                        {...field} // Spread field props (value, onChange, onBlur, name, ref)
                      />
                    </FormControl>
                    <AnimatePresence duration={300} mountClass="opacity-0" unmountClass="opacity-100" key="sasdasd">
                      {form.formState.errors[field.name]?.message}
                    </AnimatePresence>
                  </FormItem>
                </>
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
                      autoComplete="current-password" // Improve accessibility and user experience
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Displays validation errors for this field */}
                </FormItem>
              )}
            />

            {/* Remember Me Checkbox */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-7 rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>مرا به خاطر بسپار</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
      {/* CardFooter contains the submission button */}
      <CardFooter>
        <Button
          form="signin-form" // Associate button with the form using the form's id
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting} // Disable button during submission
        >
          {/* Show different text based on submission state */}
          {form.formState.isSubmitting ? "در حال ورود..." : "ورود"}
        </Button>
      </CardFooter>
    </Card>
  );
}
