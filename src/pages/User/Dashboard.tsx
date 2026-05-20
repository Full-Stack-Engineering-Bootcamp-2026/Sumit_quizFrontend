import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { getQuizzes } from "@/services/quiz.service"
import { getAttempts } from "@/services/attempt.service"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { BookOpen, Award, ArrowRight, PlayCircle, RotateCcw } from "lucide-react"

interface Quiz {
  id: string
  title: string
  createdAt: string
  questions: Array<{
    questionId: string
    questionVersionId: string
    questionText: string
  }>
}

interface Attempt {
  id: string
  userId: string
  quizId: string
}

export default function UserDashboard() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [quizData, attemptData] = await Promise.all([
        getQuizzes(),
        getAttempts(),
      ])
      setQuizzes(quizData || [])
      setAttempts(attemptData || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-zinc-500 font-medium">Loading available quizzes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left">
  
      <div className="bg-orange-500 rounded-3xl p-8 text-white shadow-lg space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-orange-50 max-w-xl leading-relaxed text-sm sm:text-base">
          Put your knowledge to the test. Browse the available quizzes configured by our instructors below and track your reattempts.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-zinc-800">Available Quizzes</h2>
        <p className="text-sm text-zinc-400 mt-1">Select a quiz below to begin or review your attempts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.length === 0 ? (
          <div className="col-span-full text-center py-16 rounded-2xl bg-white border border-zinc-200 text-zinc-400">
            No quizzes available at the moment. Check back later!
          </div>
        ) : (
          quizzes.map((quiz) => {
            // Count number of previous attempts of the current user for this specific quiz
            const userQuizAttempts = attempts.filter(
              (att) => att.quizId === quiz.id && att.userId === user?.publicId
            )
            const attemptsCount = userQuizAttempts.length
            const hasAttempted = attemptsCount > 0

            return (
              <Card
                key={quiz.id}
                className="rounded-3xl border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-orange-500 font-semibold uppercase tracking-wider">
                    <BookOpen className="h-4 w-4" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-800 line-clamp-2">
                    {quiz.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 space-y-5">
                  <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-b border-zinc-50 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      hasAttempted ? "bg-orange-100 text-orange-500" : "bg-green-100 text-green-500"
                    }`}>
                      {hasAttempted ? `${attemptsCount} reattempts` : "Not attempted"}
                    </span>
                  </div>

                  <Button asChild className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-sm font-semibold">
                    <Link to={`/user/quizzes/${quiz.id}/attempt`}>
                      {hasAttempted ? (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4" /> Reattempt Quiz
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" /> Start Quiz
                        </>
                      )}
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
