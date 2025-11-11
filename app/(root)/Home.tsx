'use client'

import { Spinner } from "@/components/ui/spinner";
import { Auth } from "../auth/Auth";
import { useAuthContext } from "../auth/AuthContext";
import { Dashboard } from "../dashboard/Dashboard";

interface HomeProps {}

export function Home(props: HomeProps) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
				<Spinner/>
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen w-full py-8">
            <Auth />
        </div>
    );
  }

  // * Authenticated Flow: If user is logged in, show the main application (Map/Dashboard)
  return (
    <Dashboard />
  );
}