import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Shield } from "lucide-react"

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-none bg-white shadow-xl">
        {/* Top decorative gradient card header */}
        <div className="relative flex h-32 items-end justify-center bg-gradient-to-r from-orange-400 to-amber-500">
          <div className="absolute -bottom-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500 text-white">
              <User size={40} className="stroke-[2.5]" />
            </div>
          </div>
        </div>

        <CardContent className="space-y-6 px-6 pt-16 pb-8 text-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-800">
              {user?.name || "Quiz User"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Account Profile</p>
          </div>

          <div className="space-y-4 border-t border-zinc-100 pt-6 text-left">
            <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-3">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">Full Name</p>
                <p className="text-sm font-semibold text-zinc-800">
                  {user?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-3">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-zinc-800">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-3">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-400">System Role</p>
                <span className="mt-0.5 inline-block rounded-full bg-orange-500 px-3 py-0.5 text-xs font-semibold text-white uppercase">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
