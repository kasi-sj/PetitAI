"use client"
import * as React from "react"

// import { ChevronsUpDown, Plus } from "lucide-react"
// import {
// DropdownMenu,
// DropdownMenuContent,
// DropdownMenuItem,
// DropdownMenuLabel,
// DropdownMenuSeparator,
// DropdownMenuShortcut,
// DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar"
import { getOrganization } from "@/actions/organization"
import {
  // AudioWaveform,
  // BookOpen,
  // Bot,
  // Command,
  // Frame,
  // GalleryVerticalEnd,
  // Map,
  // PieChart,
  // Settings2,
  // SquareTerminal,
} from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useOrganizationUser, useUserStore } from "@/utils/store"
import { getUser } from "@/actions/user"
export function TeamSwitcher({
  type
}: {
  type: "OrganizationUser" | "User" | "Admin";
}) {

  if (type === "User") {
    return <UserTeam />
  }

  if (type === "OrganizationUser") {
    return <OrganizationUserTeam />
  }

  if(type == "Admin"){
    return <AdminOrganizationUserTeam />
  }

  return <></>
}


const UserTeam = () => {
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            router.push(`/`)
          }}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Image src="/logo-transparent.png" alt="logo" className="bg-white border-black border-2" width={70} height={70} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              PetitAI
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const OrganizationUserTeam = () => {
  const router = useRouter();
  const { user } = useOrganizationUser()
  const organizationName = user.organization.name
  const { isPending, error, data: OrganizationData } = useQuery({
    queryKey: ['org', organizationName],
    queryFn: async () => await getOrganization(organizationName || ""),
  });
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            router.push(`/`)
          }}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {isPending ? <Skeleton className="h-6 w-2/3" /> : error ? "Error" : OrganizationData ? <Image src={OrganizationData?.imageURL || "/logo-transparent.png"} alt="logo" className="bg-white border-black border-2" width={70} height={70} /> : ""}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {isPending ? <Skeleton className="h-3 w-1/3" /> : error ? "Error" : OrganizationData ? OrganizationData.name : ""}
            </span>
            <span className="truncate text-xs mt-2">
              {isPending ? <Skeleton className="h-3 w-2/3" /> : error ? "Error" : OrganizationData ? OrganizationData.description : ""}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const AdminOrganizationUserTeam = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const userId = user?.userId
  const { isPending, error, data: OrganizationData } = useQuery({
    queryKey: ['organization-admin', userId],
    queryFn: async () => {
      const users = await getUser(userId || "");
      const user = users
      console.log(user , "admin")
      return await getOrganization(user.adminOf.name || "");
    }
  });
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            router.push(`/`)
          }}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {isPending ? <Skeleton className="h-6 w-2/3" /> : error ? "Error" : OrganizationData ? <Image src={OrganizationData?.imageURL || "/logo-transparent.png"} alt="logo" className="bg-white border-black border-2" width={70} height={70} /> : ""}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {isPending ? <Skeleton className="h-3 w-1/3" /> : error ? "Error" : OrganizationData ? OrganizationData?.name : ""}
            </span>
            <span className="truncate text-xs mt-2">
              {isPending ? <Skeleton className="h-3 w-2/3" /> : error ? "Error" : OrganizationData ? OrganizationData?.description : ""}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}