import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginLeftPanel from "@/components/login/LoginLeftPanel"
import LoginForm from "@/components/login/LoginForm"

export default function LoginPages() {
  const navigate = useNavigate()
  const [initialUsername] = useState(() => {
    const savedRemember = localStorage.getItem("rememberMe")
    const savedUsername = localStorage.getItem("rememberUsername")
    return savedRemember === "true" && savedUsername ? savedUsername : ""
  })
  const [initialRememberMe] = useState(() => localStorage.getItem("rememberMe") === "true")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.valid) {
          navigate("/dashboard")
        }
      })
      .catch(() => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("token")
      })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F5F7FA" }}>
      <div className="relative flex w-full max-w-[860px] min-h-[540px] rounded-2xl overflow-hidden bg-white shadow-[0_24px_70px_-32px_rgba(30,58,95,0.45),0_1px_3px_rgba(15,23,42,0.08)] border border-[#E5EAF0] transition-transform duration-300 ease-out hover:scale-[1.005]">
        <LoginLeftPanel />
        <LoginForm initialUsername={initialUsername} initialRememberMe={initialRememberMe} />
      </div>
    </div>
  )
}