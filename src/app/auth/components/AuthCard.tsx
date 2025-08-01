// ============================================================================
// FILE: @/app/auth/components/AuthCard.tsx
// ============================================================================
// PURPOSE: Provides a tabbed card interface for user authentication, allowing
//          users to switch between Sign In and Sign Up forms. It utilizes
//          Shadcn UI components and renders the SigninForm and SignupForm
//          components. Designed for Next.js App Router, React 19+, and
//          Tailwind CSS v4.
/**================================================================================================
 *                                         Imports
 *================================================================================================**/

import * as React from "react"; // Using React 19 features implicitly

// Import Shadcn UI components for the card and tabs structure
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the newly created form components
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";

/**=======================================================================================================================
 *                                                    AuthCard Component
 *=======================================================================================================================**/
export function AuthCard() {
  /**------------------------------------------------------------------------------------------------
   *                                             Render Logic
   *------------------------------------------------------------------------------------------------**/
  return (
    // Use Tabs component to switch between Sign In and Sign Up
    // Defaulting to the 'signin' tab
    // Setting width and text direction (RTL)
    <Tabs defaultValue="signin" className="w-[400px] h-135" dir="rtl">
      {/* Tab Triggers: Buttons to switch between tabs */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">ورود</TabsTrigger>
        <TabsTrigger value="signup">ثبت نام</TabsTrigger>
      </TabsList>

      {/* Sign In Tab Content */}
      <TabsContent value="signin">
        {/*//! ====== Render the SigninForm component ====== */}
        <SigninForm />
      </TabsContent>

      {/* Sign Up Tab Content */}
      <TabsContent value="signup">
        {/*//! ====== Render the SignupForm component ====== */}
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
}
