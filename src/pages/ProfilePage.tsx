import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield, Key } from "lucide-react"

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg rounded-3xl border-none shadow-xl bg-white overflow-hidden">
        {/* Top decorative gradient card header */}
        <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-500 flex items-end justify-center relative">
          <div className="absolute -bottom-12 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg border-4 border-white">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500 text-white">
              <User size={40} className="stroke-[2.5]" />
            </div>
          </div>
        </div>

        <CardContent className="pt-16 pb-8 px-6 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-800">
              {user?.name || "Quiz User"}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Account Profile
            </p>
          </div>

          <div className="border-t border-zinc-100 pt-6 text-left space-y-4">
            {/* Name Details */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-zinc-800">
                  {user?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-zinc-800">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Role designation */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">System Role</p>
                <span className="inline-block mt-0.5 rounded-full bg-orange-500 px-3 py-0.5 text-xs font-semibold text-white uppercase">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>

            {/* User public id / token identifier */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-500">
                <Key size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-400 font-medium">User Identifier (UUID)</p>
                <p className="text-xs font-mono text-zinc-600 truncate mt-0.5">
                  {user?.publicId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
