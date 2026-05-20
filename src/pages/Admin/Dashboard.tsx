import {
  Users,
  FileQuestion,
  ClipboardList,
  History,
  Plus,
  Loader2,
} from "lucide-react"

import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"

import axios from "axios"

import { toast } from "react-toastify"

interface DashboardStats {
  totalUsers: number
  totalQuestions: number
  totalQuizzes: number
  totalAttempts: number
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
  })

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const results = await Promise.allSettled([
        axios.get("http://localhost:3000/api/v1/users", { headers }),

        axios.get("http://localhost:3000/api/v1/questions", { headers }),

        axios.get("http://localhost:3000/api/v1/quizzes", { headers }),

        axios.get("http://localhost:3000/api/v1/quiz-attempts", { headers }),
      ])

      const users =
        results[0].status === "fulfilled"
          ? results[0].value.data.data?.length
          : 0

      const questions =
        results[1].status === "fulfilled"
          ? results[1].value.data.data?.length
          : 0

      const quizzes =
        results[2].status === "fulfilled"
          ? results[2].value.data.data?.length
          : 0
                                        
      const attempts =
        results[3].status === "fulfilled"
          ? results[3].value.data.data?.length
          : 0

      setStats({   
        totalUsers: users,
        totalQuestions: questions,
        totalQuizzes: quizzes,
        totalAttempts: attempts,
      })
    } catch (error) {
      toast.error("Dashboard fetch failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Questions",
      value: stats.totalQuestions,
      icon: FileQuestion,
    },
    {
      title: "Quizzes",
      value: stats.totalQuizzes,
      icon: ClipboardList,
    },
    {
      title: "Attempts",
      value: stats.totalAttempts,
      icon: History,
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left">

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>

          <p className="mt-2 text-zinc-500">
            Manage quizzes, questions, users, and attempts.
          </p>
        </div>

        <Button
          asChild
          className="rounded-xl bg-orange-500 hover:bg-orange-600"
        >
          <Link to="/admin/quizzes">
            <Plus className="mr-2 h-4 w-4" />
            Manage Quizzes
          </Link>
        </Button>
      </div>

  
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl border-none bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {item.title}
              </CardTitle>

              <div className="rounded-xl bg-orange-100 p-3">
                <item.icon className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-4xl font-bold">{item.value}</div>

              <p className="mt-2 text-sm text-zinc-500">Live system data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
