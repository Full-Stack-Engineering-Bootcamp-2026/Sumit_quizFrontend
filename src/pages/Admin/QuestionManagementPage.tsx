import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getQuestions,
  createQuestion,
  updateQuestion,
} from "@/services/question.service"
import { toast } from "react-toastify"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type QuestionType = "single_select" | "multi_select" | "text"

interface Option {
  id: string
  optionText: string
  isCorrect: boolean
}

interface QuestionHistoryVersion {
  versionNumber: number
  questionText: string
  answerType: QuestionType
  createdAt: string
  options?: Option[]
}

interface Question {
  id: string
  questionText: string
  answerType: QuestionType
  versionNumber: number
  createdAt: string
  options: Option[]
  history?: QuestionHistoryVersion[]
}

export default function QuestionManagementPage() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const [formData, setFormData] = useState({
    questionText: "",
    answerType: "single_select" as QuestionType,
    options: [
      {
        id: Math.random().toString(),
        optionText: "",
        isCorrect: false,
      },
    ],
  })

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const data = await getQuestions()
      setQuestions(data || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.questionText?.toLowerCase().includes(search.toLowerCase())
    )
  }, [questions, search])

  const resetForm = () => {
    setFormData({
      questionText: "",
      answerType: "single_select",
      options: [
        {
          id: Math.random().toString(),
          optionText: "",
          isCorrect: false,
        },
      ],
    })
    setEditingQuestion(null)
  }

  const openCreateSheet = () => {
    resetForm()
    setIsSheetOpen(true)
  }

  const openEditSheet = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      answerType: question.answerType,
      options:
        question.options && question.options.length > 0
          ? question.options.map((o) => ({
              id: o.id || Math.random().toString(),
              optionText: o.optionText,
              isCorrect: !!o.isCorrect,
            }))
          : [
              {
                id: Math.random().toString(),
                optionText: "",
                isCorrect: false,
              },
            ],
    })
    setIsSheetOpen(true)
  }

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: Math.random().toString(),
          optionText: "",
          isCorrect: false,
        },
      ],
    }))
  }

  const handleRemoveOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option.id !== id),
    }))
  }

  const handleOptionChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === id ? { ...option, optionText: value } : option
      ),
    }))
  }

  const handleCorrectToggle = (id: string) => {
    setFormData((prev) => {
      if (prev.answerType === "single_select") {
        // Only one correct option
        return {
          ...prev,
          options: prev.options.map((option) => ({
            ...option,
            isCorrect: option.id === id,
          })),
        }
      } else {
        // Multi select -> toggle target
        return {
          ...prev,
          options: prev.options.map((option) =>
            option.id === id
              ? { ...option, isCorrect: !option.isCorrect }
              : option
          ),
        }
      }
    })
  }

  const handleSubmit = async () => {
    try {
      if (!formData.questionText.trim()) {
        toast.warning("Question text cannot be blank")
        return
      }

      if (formData.answerType !== "text") {
        const filledOptions = formData.options.filter((o) =>
          o.optionText.trim()
        )
        if (filledOptions.length < 2) {
          toast.warning("Please provide at least 2 options")
          return
        }

        const hasCorrect = filledOptions.some((o) => o.isCorrect)
        if (!hasCorrect) {
          toast.warning("Please mark at least one option as correct")
          return
        }
      }

      const payload = {
        questionText: formData.questionText,
        answerType: formData.answerType,
        createdById: user?.publicId || "69a85588-9428-402f-9818-9a3545a0c526",
        options:
          formData.answerType === "text"
            ? []
            : formData.options
                .filter((o) => o.optionText.trim() !== "")
                .map((option) => ({
                  optionText: option.optionText,
                  isCorrect: option.isCorrect,
                })),
      }

      if (editingQuestion) {
        await updateQuestion(editingQuestion.id as any, payload)
        toast.success("Question version updated successfully")
      } else {
        await createQuestion(payload)
        toast.success("Question created successfully")
      }

      await fetchQuestions()
      resetForm()
      setIsSheetOpen(false)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to save question")
    }
  }

  const getTypeLabel = (type: QuestionType) => {
    switch (type) {
      case "single_select":
        return "Single Select"
      case "multi_select":
        return "Multi Select"
      case "text":
        return "Text Answer"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="font-medium text-zinc-500">Loading questions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Question Bank</h1>
          <p className="mt-2 text-zinc-500">
            Create, update, and manage version-controlled quiz questions.
          </p>
        </div>

        <Button
          onClick={openCreateSheet}
          className="h-12 rounded-2xl bg-orange-500 px-6 hover:bg-orange-600"
        >
          Add Question
        </Button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <Input
          placeholder="Search questions by text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500"
        />
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white py-12 text-center text-zinc-400">
            No questions found. Click "Add Question" to create one.
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 uppercase">
                      {getTypeLabel(question.answerType)}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-white">
                      Version {question.versionNumber}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-zinc-800">
                    {question.questionText}
                  </h2>

                  {question.options && question.options.length > 0 && (
                    <div className="space-y-1 pl-2">
                      <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Options
                      </p>
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 text-sm text-zinc-600"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-zinc-300"}`}
                          />
                          <span
                            className={
                              option.isCorrect
                                ? "font-semibold text-zinc-800"
                                : ""
                            }
                          >
                            {option.optionText}
                          </span>
                          {option.isCorrect && (
                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 uppercase">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="rounded-xl border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-500"
                  onClick={() => openEditSheet(question)}
                >
                  Edit Version
                </Button>
              </div>

              {question.history && question.history.length > 1 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={`history-${question.id}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-500 hover:no-underline">
                      View Version History ({question.history.length})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 px-2 pt-4">
                      {question.history
                        .sort((a, b) => b.versionNumber - a.versionNumber)
                        .map((ver) => (
                          <div
                            key={ver.versionNumber}
                            className="space-y-2 rounded-xl border border-zinc-100 bg-zinc-50 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="rounded-full bg-zinc-800 px-3 py-0.5 text-[10px] font-bold text-white uppercase">
                                Version {ver.versionNumber}
                              </span>
                            </div>

                            <p className="text-sm font-bold text-zinc-700">
                              {ver.questionText}
                            </p>

                            {ver.options && ver.options.length > 0 && (
                              <div className="space-y-1 pl-2">
                                {ver.options.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className="flex items-center gap-2 text-xs text-zinc-500"
                                  >
                                    <div
                                      className={`h-1.5 w-1.5 rounded-full ${opt.isCorrect ? "bg-green-500" : "bg-zinc-300"}`}
                                    />
                                    <span>{opt.optionText}</span>
                                    {opt.isCorrect && (
                                      <span className="text-[9px] font-bold text-green-600">
                                        (Correct)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ))
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto border-l bg-white px-0 sm:max-w-2xl">
          <div className="flex min-h-full flex-col">
            <div className="border-b border-zinc-100 px-8 py-6">
              <SheetHeader className="space-y-2 text-left">
                <SheetTitle className="text-2xl font-bold tracking-tight text-orange-500">
                  {editingQuestion ? "Edit Question" : "Create Question"}
                </SheetTitle>
                <SheetDescription className="text-sm text-zinc-500">
                  {editingQuestion
                    ? "Updating creates a completely new, immutable question version while preserving the old one for attempts history."
                    : "Create a new question to add to your quiz configurations."}
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 space-y-8 px-8 py-8">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-zinc-700">
                  Question Text
                </Label>
                <Textarea
                  rows={4}
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      questionText: e.target.value,
                    }))
                  }
                  placeholder="e.g., What is the primary function of dynamic question versioning?"
                  className="rounded-xl border-zinc-200 bg-zinc-50 px-4 py-3 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-orange-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-zinc-700">
                  Answer Type
                </Label>
                <Select
                  value={formData.answerType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      answerType: value as QuestionType,
                      // Clear choices if swapping to text type
                      options:
                        value === "text"
                          ? []
                          : prev.options.length === 0
                            ? [
                                {
                                  id: Math.random().toString(),
                                  optionText: "",
                                  isCorrect: false,
                                },
                              ]
                            : prev.options,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-orange-500">
                    <SelectValue placeholder="Select answer type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-200 p-2">
                    <SelectItem value="single_select" className="rounded-lg">
                      Single Select (Radio)
                    </SelectItem>
                    <SelectItem value="multi_select" className="rounded-lg">
                      Multi Select (Checkbox)
                    </SelectItem>
                    <SelectItem value="text" className="rounded-lg">
                      Text Answer (Textarea)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.answerType !== "text" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-zinc-700">
                      Options & Correct Selection
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddOption}
                      className="h-10 rounded-xl border-orange-200 px-4 text-orange-500 hover:bg-orange-50"
                    >
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.options.map((option, idx) => (
                      <div key={option.id} className="flex items-center gap-3">
                     
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={option.isCorrect}
                            onCheckedChange={() =>
                              handleCorrectToggle(option.id)
                            }
                            className="h-5 w-5 rounded border-zinc-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                          />
                        </div>

                        <Input
                          value={option.optionText}
                          onChange={(e) =>
                            handleOptionChange(option.id, e.target.value)
                          }
                          placeholder={`Enter option ${idx + 1}`}
                          className="h-12 flex-1 rounded-xl border-zinc-200 bg-zinc-50 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-orange-500"
                        />

                        {formData.options.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemoveOption(option.id)}
                            className="h-12 rounded-xl text-zinc-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 bg-white px-8 py-6">
              <Button
                onClick={handleSubmit}
                className="h-12 w-full rounded-xl bg-orange-500 text-sm font-semibold hover:bg-orange-600"
              >
                {editingQuestion ? "Save as New Version" : "Create Question"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
// touched
