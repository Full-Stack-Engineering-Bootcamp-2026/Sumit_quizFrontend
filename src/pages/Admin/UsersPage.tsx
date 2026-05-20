import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import {  Mail, User } from "lucide-react"

interface UserItem {
  publicId: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(response.data.data || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to load users list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="font-medium text-zinc-500">Loading users list...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">User Roster</h1>
        <p className="mt-2 text-zinc-500">
          Review all registered administrators and standard users in the system.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm">
        {users.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">
            No registered users found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {users.map((item) => (
              <div
                key={item.publicId}
                className="flex flex-col gap-4 p-6 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <User className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="flex items-center gap-2 text-base font-bold text-zinc-800">
                      {item.name}
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.role.toUpperCase() === "ADMIN"
                            ? "bg-orange-500 text-white"
                            : "bg-zinc-200 text-zinc-600"
                        }`}
                      >
                        {item.role}
                      </span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{item.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
