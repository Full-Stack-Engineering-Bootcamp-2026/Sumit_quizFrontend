import { useState } from "react"

import axios from "axios"

import { Link, useNavigate } from "react-router-dom"

import { useDispatch } from "react-redux"

import { setCredentials } from "@/store/slices/authSlice"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"

import { Eye, EyeOff, Loader2 } from "lucide-react"

import { toast } from "react-toastify"

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        formData
      )

      const token = response.data.data.token

      const user = response.data.data.user

      localStorage.setItem("token", token)

      localStorage.setItem("user", JSON.stringify(user))

      dispatch(
        setCredentials({
          token,
          user,
        })
      )

      toast.success("Login successful")

      console.log(user)

      if (user.role === "ADMIN" || user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        })
      } else {
        navigate("/user/dashboard", {
          replace: true,
        })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4 dark:from-zinc-950 dark:to-black">
      <Card className="w-full max-w-md rounded-3xl border border-orange-200 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            >
              <source src="/Quiz.mp4" type="video/mp4" />
            </video>
          </div>

          <CardTitle className="text-4xl font-bold text-orange-500">
            Login
          </CardTitle>

          <CardDescription className="text-zinc-500">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-500">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 rounded-xl border-orange-200 focus-visible:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-orange-500">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-xl border-orange-200 pr-12 focus-visible:ring-orange-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-orange-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">Don&apos;t have an account?</p>

            <Link
              to="/register"
              className="mt-1 inline-block text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
            >
              Register User
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
