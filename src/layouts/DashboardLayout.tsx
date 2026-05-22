import { Outlet } from "react-router-dom"

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"

import AppSidebar from "@/components/layout/AppSidebar"
import AppFooter from "@/components/layout/AppFooter"

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="flex min-h-screen flex-col">
   

          <main className="flex-1 p-6 bg-zinc-50">
            <Outlet />
          </main>

          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout