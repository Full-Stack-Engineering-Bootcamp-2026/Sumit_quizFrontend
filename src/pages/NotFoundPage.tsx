import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Button } from "@/components/ui/button"

export const NotFoundPage = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )

  // Determine standard redirect link
  let redirectUrl = "/"
  if (isAuthenticated && user) {
    if (user.role.toUpperCase() === "ADMIN") {
      redirectUrl = "/admin/dashboard"
    } else {
      redirectUrl = "/user/dashboard"
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-100 text-5xl font-extrabold text-orange-500 shadow-md">
        404
      </div>

      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
        Page Not Found
      </h1>

      <p className="mt-4 text-lg text-zinc-500 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="mt-8">
        <Button asChild className="h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 px-8 text-base">
          <Link to={redirectUrl}>
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
