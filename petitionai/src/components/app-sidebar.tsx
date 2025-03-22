"use client";
// import { getUser } from "@/actions/user";
// import { useUserStore } from "@/utils/store";
import * as React from "react";
// import {
//   // AudioWaveform,
//   BookOpen,
//   Bot,
//   // Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   Settings2,
//   SquareTerminal,
// } from "lucide-react"

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  type,
  ...props
}: {
  type: "OrganizationUser" | "User" | "Admin";
  Organization?: {
    id: string;
    name: string;
    imageURL: string;
    description: string;
  };
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher type={type} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain type={type} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser type={type == "OrganizationUser" ? "OrganizationUser" : "User"} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
