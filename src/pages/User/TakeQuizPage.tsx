import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { getQuizById } from "@/services/quiz.service"
import { createAttempt } from "@/services/attempt.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "react-toastify"
import { ChevronLeft, Send, ClipboardList, Info } from "lucide-react"

interface QuestionOption {
  id: string
  optionText: string
}

interface QuizQuestion {
  questionId: string
  questionVersionId: string
  versionNumber: number
  questionText: string
  answerType: "single_select" | "multi_select" | "text"
  options: QuestionOption[]
}

interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
}

export default function TakeQuizPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [answersState, setAnswersState] = useState<
    Record<
      string,
      {
        answerText: string
        selectedOptionIds: string[]
      }
    >
  >({})

  const fetchQuizDetails = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await getQuizById(id)
      setQuiz(data)

      // Initialize answers state
      const initialAnswers: typeof answersState = {}
      data.questions?.forEach((q: QuizQuestion) => {
        initialAnswers[q.questionVersionId] = {
          answerText: "",
          selectedOptionIds: [],
        }
      })
      setAnswersState(initialAnswers)
    } catch (error) {
      console.log(error)
      toast.error("Failed to load quiz details")
      navigate("/user/dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizDetails()
  }, [id])

  const handleTextChange = (versionId: string, text: string) => {
    setAnswersState((prev) => ({
      ...prev,
      [versionId]: {
        ...prev[versionId],
        answerText: text,
      },
    }))
  }

  const handleRadioChange = (versionId: string, optionId: string) => {
    setAnswersState((prev) => ({
      ...prev,
      [versionId]: {
        ...prev[versionId],
        selectedOptionIds: [optionId],
      },
    }))
  }

  const handleCheckboxToggle = (versionId: string, optionId: string) => {
    setAnswersState((prev) => {
      const currentSelected = prev[versionId]?.selectedOptionIds || []
      const updatedSelected = currentSelected.includes(optionId)
        ? currentSelected.filter((id) => id !== optionId)
        : [...currentSelected, optionId]

      return {
        ...prev,
        [versionId]: {
          ...prev[versionId],
          selectedOptionIds: updatedSelected,
        },
      }
    })
  }

  const handleSubmit = async () => {
    if (!quiz) return

    // Simple validation: check if all questions are filled/answered
    let allAnswered = true
    const formattedAnswers = quiz.questions?.map((q) => {
      const state = answersState[q.questionVersionId]
      const isText = q.answerType === "text"

      if (isText && !state?.answerText.trim()) {
        allAnswered = false
      }
      if (!isText && (!state?.selectedOptionIds || state.selectedOptionIds.length === 0)) {
        allAnswered = false
      }

      return {
        questionVersionId: q.questionVersionId,
        answerText: isText ? state.answerText : undefined,
        selectedOptionIds: !isText ? state.selectedOptionIds : undefined,
      }
    })

    if (!allAnswered) {
      toast.warning("Please answer all questions before submitting")
      return
    }

    try {
      setSubmitting(true)
      await createAttempt({
        userId: user?.publicId || "",
        quizId: quiz.id,
        answers: formattedAnswers,
      })

      toast.success("Quiz attempt submitted successfully!")
      navigate("/user/attempts")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit attempt")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-zinc-500 font-medium">Loading quiz questions...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Quiz not found.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-16">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/user/dashboard")}
          className="rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Quizzes
        </Button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">
            {quiz.title}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Answer the questions below. All submissions are locked to this question version.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Version Audit Security Notice</p>
          <p className="mt-0.5 opacity-90 leading-relaxed">
            Your responses are tied to the exact question structures displayed right now. Any subsequent modifications to these questions by administrators will not affect the scoring or historical audit accuracy of this attempt.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions?.map((question, idx) => {
          const versionId = question.questionVersionId
          const state = answersState[versionId]

          return (
            <Card key={versionId} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4 px-6 flex flex-row items-center justify-between">
                <span className="font-bold text-sm text-zinc-500 uppercase tracking-wider">
                  Question {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
                  Version {question.versionNumber}
                </span>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-base font-extrabold text-zinc-800 leading-snug">
                  {question.questionText}
                </h3>

                {question.answerType === "text" && (
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Write your answer:
                    </Label>
                    <Textarea
                      rows={4}
                      value={state?.answerText || ""}
                      onChange={(e) => handleTextChange(versionId, e.target.value)}
                      placeholder="Type your explanation here..."
                      className="rounded-xl border-zinc-200 bg-zinc-50 focus-visible:ring-orange-500 text-sm shadow-none focus-visible:ring-1 p-4"
                    />
                  </div>
                )}

                {question.answerType === "single_select" && (
                  <RadioGroup
                    value={state?.selectedOptionIds[0] || ""}
                    onValueChange={(val) => handleRadioChange(versionId, val)}
                    className="space-y-3"
                  >
                    {question.options?.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleRadioChange(versionId, option.id)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          state?.selectedOptionIds[0] === option.id
                            ? "border-orange-500 bg-orange-50/20"
                            : "border-zinc-100 bg-zinc-50/50 hover:border-orange-100"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.id}
                          checked={state?.selectedOptionIds[0] === option.id}
                          className="border-zinc-300 text-orange-500 focus-visible:ring-orange-500"
                        />
                        <span className="text-sm font-semibold text-zinc-700">
                          {option.optionText}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.answerType === "multi_select" && (
                  <div className="space-y-3">
                    {question.options?.map((option) => {
                      const isChecked = state?.selectedOptionIds.includes(option.id)

                      return (
                        <div
                          key={option.id}
                          onClick={() => handleCheckboxToggle(versionId, option.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? "border-orange-500 bg-orange-50/20"
                              : "border-zinc-100 bg-zinc-50/50 hover:border-orange-100"
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => {}} // handled by parent onClick
                            className="h-5 w-5 rounded border-zinc-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="text-sm font-semibold text-zinc-700">
                            {option.optionText}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="h-12 bg-orange-500 hover:bg-orange-600 rounded-2xl px-10 text-base font-bold text-white shadow-md w-full sm:w-auto"
        >
          {submitting ? (
            "Submitting Attempt..."
          ) : (
            <>
              Submit Quiz Attempt <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}


