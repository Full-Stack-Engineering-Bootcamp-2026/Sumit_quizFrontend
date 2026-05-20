import { BrowserRouter, Routes, Route } from "react-router-dom"

import LoginPage from "./pages/Login"
import RegisterPage from "./pages/RegistrationPage"


import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"

import ProtectedRoute from "./components/ProtectedRoute"

import AdminDashboard from "./pages/Admin/Dashboard"
import QuestionManagementPage from "./pages/Admin/QuestionManagementPage"
import QuizzesPage from "./pages/Admin/QuizzesPage"
import AttemptsPage from "./pages/Admin/AttemptsPage"
import UsersPage from "./pages/Admin/UsersPage"


import UserDashboard from "./pages/User/Dashboard"
import TakeQuizPage from "./pages/User/TakeQuizPage"
import UserAttemptsPage from "./pages/User/AttemptsPage"

import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/questions" element={<QuestionManagementPage />} />
            <Route path="/admin/quizzes" element={<QuizzesPage />} />
            <Route path="/admin/attempts" element={<AttemptsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/quizzes/:id/attempt" element={<TakeQuizPage />} />
            <Route path="/user/attempts" element={<UserAttemptsPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
