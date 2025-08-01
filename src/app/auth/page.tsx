// ============================================================================
// FILE: app/auth/page.tsx
// ============================================================================
// PURPOSE: Defines the route `/auth` and renders the AuthCard component.
//          Includes a simple counter example.
/**================================================================================================
 *                                         Imports
 *================================================================================================**/
// Import the card component
import { AuthCard } from "./components/AuthCard";

/**=======================================================================================================================
 *                                                    AuthPage Component
 *=======================================================================================================================**/
export default function AuthPage() {
  /**------------------------------------------------------------------------------------------------
   *                                             Render Logic
   *------------------------------------------------------------------------------------------------**/
  return (
    // Center the content on the page using Tailwind CSS flexbox utilities.
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-4">
      {/*//! ====== Render the AuthCard component ====== */}
      <AuthCard />
    </div>
  );
}
