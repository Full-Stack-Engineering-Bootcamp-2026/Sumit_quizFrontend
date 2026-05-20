import axios from "axios"

const API = "http://localhost:3000/api/v1/quiz-attempts"

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const getAttempts = async () => {
  const response = await axios.get(API, getHeaders())
  return response.data.data
}

export const getAttemptById = async (id: string) => {
  const response = await axios.get(`${API}/${id}`, getHeaders())
  return response.data.data
}

export const createAttempt = async (payload: {
  userId: string
  quizId: string
  answers: Array<{
    questionVersionId: string
    answerText?: string
    selectedOptionIds?: string[]
  }>
}) => {
  const response = await axios.post(API, payload, getHeaders())
  return response.data.data
}
