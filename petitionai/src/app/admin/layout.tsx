'use client'
import { getUser } from "@/actions/user";
import { AppSidebar } from "@/components/app-sidebar"
import Heading from "@/components/heading"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page({
    children,
}: {
    children: React.ReactNode,
}) {
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
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (data && !data?.isAdmin) {
            setRedirecting(true);
            setTimeout(() => {
                router.replace("/user"); // Auto-redirect after delay
            }, 3000);
        }
    }, [data, router]);

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

    if (data && !data?.isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-semibold text-gray-700">Unauthorized</h1>
                    <p className="mt-4 text-gray-600">
                        Access to admin features is restricted.
                    </p>
                    <p className="mt-2 text-gray-600">You will be redirected soon.</p>

                    {redirecting && (
                        <div className="mt-4 flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-red-500"></div>
                        </div>
                    )}

                    <button
                        onClick={() => router.push("/user")}
                        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Go to User Dashboard
                    </button>
                </div>
            </div>
        );
    }


    return (
        <SidebarProvider>
            <AppSidebar type="Admin" />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                    <Heading />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
