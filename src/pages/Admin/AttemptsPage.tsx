import { useEffect, useState } from "react"
import { getAttempts } from "@/services/attempt.service"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "react-toastify"
import { User, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { CardHeader } from "@/components/ui/card"

interface AttemptAnswer {
  questionId: string
  questionVersionId: string
  questionText: string
  answerType: string
  answerText?: string
  selectedOptions?: Array<{
    id: string
    optionText: string
    isCorrect: boolean
  }>
}

interface Attempt {
  id: string
  userId: string
  userName: string
  userEmail: string
  quizId: string
  quizTitle: string
  attemptNumber: number
  submittedAt: string
  answers: AttemptAnswer[]
}

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttemptsList = async () => {
    try {
      setLoading(true)
      const data = await getAttempts()

      setAttempts(data || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to load attempt logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttemptsList()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="font-medium text-zinc-500">Loading attempts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Audit Attempts Logs
        </h1>
        <p className="mt-2 text-zinc-500">
          Review historical user quiz attempts, preserving the exact question
          version at the moment of submission.
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white py-12 text-center text-zinc-400">
          No quiz attempts submitted yet.
        </div>
      ) : (
        <div className="space-y-6">
          {attempts.map((attempt) => {
            // Let's calculate simple score for single/multi select questions
            let correctCount = 0
            let gradableCount = 0

            attempt.answers?.forEach((ans) => {
              if (ans.answerType !== "text") {
                gradableCount++
                // check if the selected options are exactly the correct ones
                const allSelectedCorrect =
                  ans.selectedOptions?.every((opt) => opt.isCorrect) &&
                  ans.selectedOptions?.length ===
                    ans.selectedOptions?.filter((o) => o.isCorrect).length
                if (allSelectedCorrect) {
                  correctCount++
                }
              }
            })

            return (
              <div
                key={attempt.id}
                className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-800">
                        {attempt.quizTitle}
                      </h3>
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                        Attempt #{attempt.attemptNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-1 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                          {attempt.userName} ({attempt.userEmail})
                        </span>
                      </div>
                    </div>
                  </div>

                  {gradableCount > 0 && (
                    <div className="text-right">
                      <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Score
                      </p>
                      <p className="text-2xl font-black text-orange-500">
                        {correctCount} / {gradableCount}
                      </p>
                    </div>
                  )}
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={`answers-${attempt.id}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-500 hover:no-underline">
                      Audit Question-by-Question Submission
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-2 pt-4">
                      {attempt.answers?.map((ans, idx) => {
                        const isText = ans.answerType === "text"
                        // For MCQ, let's see if correctness matches
                        const isCorrect =
                          !isText &&
                          ans.selectedOptions?.every((o) => o.isCorrect)

                        return (
                          <div
                            key={idx}
                            className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4"></CardHeader>
                              {!isText ? (
                                isCorrect ? (
                                  <span className="flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-600 uppercase">
                                    <CheckCircle2 className="h-3.5 w-3.5" />{" "}
                                    Correct Choice
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 uppercase">
                                    <XCircle className="h-3.5 w-3.5" />{" "}
                                    Incorrect
                                  </span>
                                )
                              ) : (
                                <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 uppercase">
                                  <AlertCircle className="h-3.5 w-3.5" />{" "}
                                  Written Answer
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-bold text-zinc-700">
                              {ans.questionText ||
                                "Question text at time of attempt"}
                            </p>

                            {/* Submitted Answers detail */}
                            {isText ? (
                              <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-700 italic">
                                "{ans.answerText || "No answer text submitted"}"
                              </div>
                            ) : (
                              <div className="space-y-1.5 pl-2">
                                <p className="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                                  Options selected in this version:
                                </p>
                                {ans.selectedOptions &&
                                ans.selectedOptions.length > 0 ? (
                                  ans.selectedOptions.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className="flex items-center gap-2 text-xs text-zinc-600"
                                    >
                                      <div
                                        className={`h-1.5 w-1.5 rounded-full ${opt.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                                      />
                                      <span>{opt.optionText}</span>
                                      <span
                                        className={`text-[9px] font-bold uppercase ${opt.isCorrect ? "bg-green-50 px-1 text-green-600" : "bg-red-50 px-1 text-red-500"} rounded`}
                                      >
                                        {opt.isCorrect
                                          ? "Correct Choice"
                                          : "Incorrect"}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-zinc-400 italic">
                                    No option selected.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
