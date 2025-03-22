'use client'
import { AppSidebar } from "@/components/app-sidebar"
import Heading from "@/components/heading"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useOrganizationUser } from "@/utils/store";
import Link from "next/link";

export default function Page({
    children,
}: {
    children: React.ReactNode,
}) {

    const { user } = useOrganizationUser();
    const userId = user.id;
    console.log("data", userId)

    if (!userId) {
        return <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Seems like you&apos;re not logged in!
                </h1>
                <p className="mt-2 text-gray-600">
                    Please log in to access this page.
                </p>
                <Link
                    href="/organization-sign-in"
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Try Logging In
                </Link>
            </div>
        </div>
    }

    return (
        <SidebarProvider>
            <AppSidebar type="OrganizationUser" />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                    <Heading />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
