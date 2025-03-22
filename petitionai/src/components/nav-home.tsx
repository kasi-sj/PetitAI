"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { useOrganizationUser } from "@/utils/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const { user, logout } = useUserStore();
  const { user: organizationUser, logoutOrganizationUser } =
    useOrganizationUser();
  const router = useRouter();

  const handleLogout = () => {
    if (user?.userId) logout();
    if (organizationUser?.id) logoutOrganizationUser();
    router.push("/sign-in");
  };

  console.log("data", user, organizationUser);


  return (
    <nav className="bg-white shadow-md py-4 px-10 flex justify-between items-center relative">
      {/* Title */}
      <Link href="/" className="text-2xl font-bold text-gray-900">
        PetitAI
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        {user?.userId || organizationUser?.id ? (
          <>
            <Link
              href={organizationUser?.id ? "/organization-user" : "/user"}
              className="px-4 py-2 bg-black text-white font-bold rounded-lg"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white font-bold rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-black text-white font-bold rounded-lg">
                Sign In
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-black">
              <DropdownMenuItem
                onClick={() => router.push("/organization-sign-in")}
                className="block w-full px-4 py-2 text-left font-bold hover:bg-gray-100"
              >
                Organization User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/sign-in")}
                className="block w-full px-4 py-2 text-left font-bold hover:bg-gray-100"
              >
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
