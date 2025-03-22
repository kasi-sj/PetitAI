'use client'
import { getUser } from "@/actions/user";
import { AppSidebar } from "@/components/app-sidebar";
import Heading from "@/components/heading";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page({ children }: { children: React.ReactNode }) {
  const userId = useUserStore((state) => state.user?.userId);
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      console.log("userId", userId)
      const data = await getUser(userId || "")
      console.log("result", userId, data)
      return data
    }
  });
  console.log("data", userId, data)

  if (!data) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-700">
          Seems like you&apos;re not logged in!
        </h1>
        <p className="mt-2 text-gray-600">
          Please log in to access this page.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Try Logging In
        </Link>
      </div>
    </div>
  }

  if (data && data?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800">Welcome, User</h1>
          <p className="mt-4 text-gray-600">
            You are currently logged in as a standard user.
            If you have admin privileges, please proceed to the admin panel.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar type="User" />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <Heading />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
