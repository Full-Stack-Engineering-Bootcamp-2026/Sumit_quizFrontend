import {
  LayoutDashboard,
  FileQuestion,
  ClipboardList,
  History,
  Users,
  User,
  LogOut,
} from "lucide-react"

import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"
import type { RootState } from "@/store/store"

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

export const AdminSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    dispatch(logout())
    navigate("/")
  }

  return (
    <Sidebar className="border-r border-zinc-200">
      {/* Header */}
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-xl">
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
          <div>
            <h2 className="text-lg leading-none font-bold text-orange-500">
              QuizBowser
            </h2>
            <p className="mt-1 text-xs text-zinc-500">Admin Panel</p>
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
                    <Link
                      to={item.url}
                      className="flex items-center gap-4 px-4"
                    >
                      <item.icon className="h-6 w-6" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Add a direct Logout Button to menu for convenience */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="h-14 rounded-xl text-base font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600"
                >
                  <div className="flex w-full items-center gap-4 px-4">
                    <LogOut className="h-6 w-6" />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / Profile Link */}
      <SidebarFooter className="border-t border-zinc-100 p-4">
        <Link
          to="/admin/profile"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-zinc-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
            <User size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-800">
              {user?.name || "Admin User"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user?.email || "admin@quiz.com"}
            </p>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
