import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { getQuizzes, createQuiz, deleteQuiz } from "@/services/quiz.service"
import { getQuestions } from "@/services/question.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "react-toastify"
import { Trash2, Plus, Calendar, BookOpen } from "lucide-react"

interface Question {
  id: string
  questionText: string
  versionNumber: number
}

interface Quiz {
  id: string
  title: string
  createdById: string
  createdAt: string
  questions: Array<{
    questionId: string
    questionVersionId: string
    questionText: string
    versionNumber: number
  }>
}

export default function QuizzesPage() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Creation State
  const [title, setTitle] = useState("")
  const [selectedQuestionVersionIds, setSelectedQuestionVersionIds] = useState<string[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [quizData, questionData] = await Promise.all([
        getQuizzes(),
        getQuestions(),
      ])
      setQuizzes(quizData || [])
      setQuestions(questionData || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch quizzes or questions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleQuestion = (versionId: string) => {
    setSelectedQuestionVersionIds((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : [...prev, versionId]
    )
  }

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return
    try {
      await deleteQuiz(id)
      toast.success("Quiz deleted successfully")
      fetchData()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete quiz")
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.warning("Quiz title is required")
      return
    }

    if (selectedQuestionVersionIds.length === 0) {
      toast.warning("Please select at least 1 question for the quiz")
      return
    }

    try {
      await createQuiz({
        title,
        createdById: user?.publicId || "",
        questionVersionIds: selectedQuestionVersionIds,
      })

      toast.success("Quiz created successfully")
      setTitle("")
      setSelectedQuestionVersionIds([])
      setIsSheetOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create quiz")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-zinc-500 font-medium">Loading quizzes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quiz Management</h1>
          <p className="mt-2 text-zinc-500">
            Create quizzes and configure their questions with version tracking.
          </p>
        </div>

        <Button
          onClick={() => setIsSheetOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 rounded-2xl h-12 px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Button>
      </div>

      {/* Quizzes List */}
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.length === 0 ? (
          <div className="col-span-2 text-center py-12 rounded-2xl bg-white border border-zinc-200 text-zinc-400">
            No quizzes created yet. Click "Create Quiz" to configure your first one.
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-800">{quiz.title}</h3>
                  <Button
                    variant="outline"
                    className="rounded-xl hover:bg-red-50 hover:text-red-500 border-zinc-200 text-zinc-400 p-2 h-10 w-10"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{quiz.questions?.length || 0} Questions</span>
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Questions Configured:
                  </p>
                  {quiz.questions && quiz.questions.length > 0 ? (
                    <div className="space-y-1.5 pl-1">
                      {quiz.questions.map((q, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
                          <span className="font-medium text-orange-500">{idx + 1}.</span>
                          <span className="truncate flex-1">{q.questionText || "Question text not loaded"}</span>
                          <span className="rounded bg-zinc-100 text-[10px] px-1.5 py-0.5 font-bold text-zinc-500">
                            V{q.versionNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">No questions added.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Quiz Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto border-l bg-white px-0 sm:max-w-2xl">
          <div className="flex min-h-full flex-col">
            <div className="border-b px-8 py-6 border-zinc-100">
              <SheetHeader className="space-y-2 text-left">
                <SheetTitle className="text-2xl font-bold text-orange-500">
                  Create New Quiz
                </SheetTitle>
                <SheetDescription className="text-sm text-zinc-500">
                  Enter a quiz title and map questions from the Question Bank below.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 space-y-8 px-8 py-8">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-zinc-700">Quiz Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., General TypeScript Quiz"
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 focus-visible:ring-orange-500 shadow-none focus-visible:ring-1"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-zinc-700">
                  Select Questions ({selectedQuestionVersionIds.length} Selected)
                </Label>

                {questions.length === 0 ? (
                  <p className="text-sm text-zinc-400 italic">
                    No questions available in the Question Bank. Create questions first.
                  </p>
                ) : (
                  <div className="space-y-3 border rounded-xl p-4 bg-zinc-50/50 max-h-[350px] overflow-y-auto border-zinc-200">
                    {questions.map((q) => {
                      // Note: In backend_audit we returned option ID and history,
                      // latestVersion publicId is returned on question.history[0] or latest version mapping
                      // Let's grab the version UUID from history or use item's latest version ID
                      // Wait! The GET /questions returns questionOutDto, which represents the latest version itself.
                      // So the latest version ID is simply the question.id (or question.publicId)!
                      const versionId = q.id
                      const isChecked = selectedQuestionVersionIds.includes(versionId)

                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuestion(versionId)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? "border-orange-500 bg-orange-50/30"
                              : "border-zinc-200 bg-white hover:border-orange-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent onClick
                            className="mt-1 h-4 w-4 rounded border-zinc-300 accent-orange-500"
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-zinc-800 leading-tight">
                              {q.questionText}
                            </p>
                            <span className="inline-block text-[10px] font-bold text-zinc-500 bg-zinc-100 rounded px-1.5 py-0.5">
                              Version {q.versionNumber}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-100 bg-white px-8 py-6">
              <Button
                onClick={handleSubmit}
                className="h-12 w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-sm font-semibold"
              >
                Create Quiz
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
