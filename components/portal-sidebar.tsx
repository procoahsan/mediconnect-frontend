"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Calendar, MessageSquare, Home, User, FileText, Settings, LogOut } from "lucide-react"

export function PortalSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <SidebarProvider defaultOpen={true} open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader className="pb-0">
          <div className="flex items-center px-2 py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600 mr-2"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <h1 className="text-xl font-bold text-blue-600">MediConnect</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal")}>
                <Link href="/portal">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/appointments")}>
                <Link href="/portal/appointments">
                  <Calendar className="h-5 w-5" />
                  <span>Appointments</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/appointments/view")}>
                <Link href="/portal/appointments/view">
                  <Calendar className="h-5 w-5" />
                  <span>View Appointments</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/chat")}>
                <Link href="/portal/chat">
                  <MessageSquare className="h-5 w-5" />
                  <span>Medical Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/profile")}>
                <Link href="/portal/profile">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/records")}>
                <Link href="/portal/records">
                  <FileText className="h-5 w-5" />
                  <span>Medical Records</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/portal/settings")}>
                <Link href="/portal/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarTrigger />
      </Sidebar>
    </SidebarProvider>
  )
}
