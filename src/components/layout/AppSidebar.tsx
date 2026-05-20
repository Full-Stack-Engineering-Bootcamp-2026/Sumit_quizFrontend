import {
  LayoutDashboard,
  FileQuestion,
  ClipboardList,
  History,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Questions",
    url: "/admin/questions",
    icon: FileQuestion,
  },
  {
    title: "Quizzes",
    url: "/admin/quizzes",
    icon: ClipboardList,
  },
  {
    title: "Attempts",
    url: "/admin/attempts",
    icon: History,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
]

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-zinc-200">
      {" "}
      {/* Header */}
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-20 w-20 overflow-hidden rounded-xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            >
              <source src="/Quiz.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-orange-500">QuizBowser</h2>

            <p className="text-xs text-zinc-500">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-14 rounded-xl text-base font-medium hover:bg-orange-100 hover:text-orange-500"
                  >
                    <a href={item.url} className="flex items-center gap-4 px-4">
                      <item.icon className="h-6 w-6" />

                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-medium">Admin</p>

            <p className="text-xs text-zinc-500">admin@quiz.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
