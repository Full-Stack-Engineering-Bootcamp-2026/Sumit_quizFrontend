import axios from "axios"

const API = "http://localhost:3000/api/v1/questions"

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const getQuestions = async () => {
  const response = await axios.get(API, getHeaders())
  return response.data.data
}

export const createQuestion = async (payload: any) => {
  console.log(payload)
  const response = await axios.post(API, payload, getHeaders())
  return response.data.data
}

export const updateQuestion = async (id: number, payload: any) => {
  const response = await axios.put(`${API}/${id}`, payload, getHeaders())
  return response.data.data
}
