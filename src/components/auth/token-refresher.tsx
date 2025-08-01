"use client";
import { authClient, useSession } from "@/lib/better-auth/auth-client";
import { useEffect, useState } from "react";

// Define props interface for the component
interface AuthRefreshProps {
  refreshIntervalMs?: number; // Optional interval in milliseconds
}

// Default refresh interval: 24 hours
const DEFAULT_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

export const AuthRefreshToken: React.FC<AuthRefreshProps> = ({ refreshIntervalMs = DEFAULT_REFRESH_INTERVAL }) => {
  const [error, setError] = useState<{
    code?: string | undefined;
    message?: string | undefined;
    status?: number | undefined;
    statusText?: string | undefined;
  } | null>(null);

  // Function to fetch and refresh session
  const refreshSession = async () => {
    try {
      const { error } = await authClient.getSession({
        fetchOptions: {
          credentials: "include",
        },
      });
      if (error) {
        setError(error);
        return;
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      setError({ message: "Failed to refresh session" });
      console.error("Session refresh error:", err);
    }
  };

  // Effect to run on mount and set up interval
  useEffect(() => {
    // Initial session fetch on mount
    refreshSession();

    // Set up interval for periodic refresh
    const intervalId = setInterval(refreshSession, refreshIntervalMs);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [authClient, refreshIntervalMs]);

  // useSession();

  // Optionally render error state if needed
  if (error) {
    return <div className="text-red-500">{error.message ?? "can't retrive a cookie"}</div>;
  }

  // Render nothing by default, as this is a utility component
  return null;
};
