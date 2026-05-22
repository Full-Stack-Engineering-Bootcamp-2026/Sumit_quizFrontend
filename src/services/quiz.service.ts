import axios from "axios"

const API = "http://localhost:3000/api/v1/quizzes"

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const getQuizzes = async () => {
  const response = await axios.get(API, getHeaders())
  return response.data.data
}

export const getQuizById = async (id: string) => {
  const response = await axios.get(`${API}/${id}`, getHeaders())
  return response.data.data
}

export const createQuiz = async (payload: {
  title: string
  createdById: string
  questionVersionIds: string[]
}) => {
  const response = await axios.post(API, payload, getHeaders())
  return response.data.data
}

export const updateQuiz = async (id: string, payload: any) => {
  const response = await axios.put(`${API}/${id}`, payload, getHeaders())
  return response.data.data
}

export const deleteQuiz = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, getHeaders())
  return response.data.data
}
