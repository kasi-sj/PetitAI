"use client";

import { ChevronRight } from "lucide-react";
import {
  UserCircle,
  Bookmark,
  PlusCircle,
  FileText,
  Building,
  BarChart3,
  Users,
  Folder,
  ShieldCheck,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import SpinningProgress from "./spinning-progress";
import Link from "next/link";
import { getUserOrganizations } from "@/actions/user";
import { useUserStore } from "@/utils/store";

export function NavMain({
  type,
}: {
  type: "OrganizationUser" | "User" | "Admin";
}) {
  if (type === "User") {
    return <UserOrganizations />;
  }

  if (type === "OrganizationUser") {
    return <OrganizationUserMain />;
  }

  if (type === "Admin") {
    return <AdminUserMain />;
  }

  return <></>;
}

const UserOrganizations = () => {
  const userId = useUserStore((state) => state.user?.userId);

  const {
    isPending,
    error,
    data: organizations,
  } = useQuery({
    queryKey: ["getting-user-organizations", userId],
    queryFn: async () => {
      return (await getUserOrganizations(userId || ""))?.organizations;
    },
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinningProgress size={8} />
      </div>
    );

  const items = [
    {
      name: "Saved Petitions",
      url: "/user/saved-petitions",
      icon: Bookmark,
    },
    {
      name: "Profile",
      url: "/user",
      icon: UserCircle,
    },
    {
      name: "Create Petition",
      url: "/user/petitions/create",
      icon: PlusCircle,
    },
  ];

  return (
    <div>
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible
            key={"Organizations"}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={"Organizations"}>
                  <Building />
                  <span>{"Organizations"}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {isPending && (
                    <div>
                      <SpinningProgress size={8} />
                    </div>
                  )}
                  {error && <div>Error...</div>}
                  {organizations?.length === 0 && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span>No organizations</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {organizations?.length > 0 && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/user/petitions/`}>
                          <span>All Organizations</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {organizations?.map(
                    (organization: { name: string; description: string }) => (
                      <SidebarMenuSubItem key={organization.name}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/user/petitions/${organization.name}`}>
                            <span>{organization.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
};

const OrganizationUserMain = () => {
  const items = [
    {
      name: "Saved Petitions",
      url: "/organization-user/saved-petitions",
      icon: Bookmark,
    },
    {
      name: "Profile",
      url: "/organization-user",
      icon: UserCircle,
    },
    {
      name: "Petitions",
      url: "/organization-user/petitions/",
      icon: FileText,
    },
    {
      name: "Organization",
      url: "/organization-user/organization",
      icon: Building,
    },
    {
      name: "Analytics",
      url: "/organization-user/analytics/",
      icon: BarChart3,
    },
    {
      name: "Users",
      url: "/organization-user/users",
      icon: Users,
    },
    {
      name: "Departments",
      url: "/organization-user/departments",
      icon: Folder,
    },
    {
      name: "User Roles",
      url: "/organization-user/user-roles",
      icon: ShieldCheck,
    },
  ];

  return (
    <div>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
};

const AdminUserMain = () => {
  const items = [
    {
      name: "Saved Petitions",
      url: "/admin/saved-petitions/",
      icon: Bookmark,
    },
    {
      name: "Profile",
      url: "/admin/",
      icon: UserCircle,
    },
    {
      name: "Petitions",
      url: "/admin/petitions",
      icon: FileText,
    },
    {
      name: "Organization",
      url: "/admin/organization",
      icon: Building,
    },
    {
      name: "Analytics",
      url: "/admin/analytics/",
      icon: BarChart3,
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      name: "Departments",
      url: "/admin/departments",
      icon: Folder,
    },
    {
      name: "User Roles",
      url: "/admin/user-roles",
      icon: ShieldCheck,
    },
  ];

  return (
    <div>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
};
