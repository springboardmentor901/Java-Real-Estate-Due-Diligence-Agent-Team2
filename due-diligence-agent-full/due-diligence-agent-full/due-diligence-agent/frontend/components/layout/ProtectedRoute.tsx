"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Spinner from "@/components/ui/Spinner";
import type { Role } from "@/lib/types";

/**
 * Reuses the same "is there a valid session" check for every logged-in
 * page, and layers one extra role check on top for Administrator-only
 * pages — matching the pattern described in the frontend spec (section 5)
 * instead of inventing a separate mechanism for the admin page.
 */
export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: Role;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, requiredRole, router]);

  if (isLoading || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="h-6 w-6 text-ink-faint" />
      </div>
    );
  }

  return <>{children}</>;
}
