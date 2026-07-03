import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import SmartSpiritLogo from "@/components/SmartSpiritLogo"

function FieldIcon({ children }) {
  return <span className="text-[#6B7280] shrink-0 flex items-center">{children}</span>
}

export default function LoginPages() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const savedRemember = localStorage.getItem("rememberMe")
    const savedUsername = localStorage.getItem("rememberUsername")
    if (savedRemember === "true" && savedUsername) {
      setRememberMe(true)
      setUsername(savedUsername)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setApiError("")
    const newErrors = { username: "", password: "" }
    let hasError = false

    if (username === "") {
      newErrors.username = "Kullanıcı adı boş geçilemez"
      hasError = true
    }

    if (password === "") {
      newErrors.password = "Parola boş geçilemez"
      hasError = true
    }

    setErrors(newErrors)
    if (hasError) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("token", data.token)

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
          localStorage.setItem("rememberUsername", username)
        } else {
          localStorage.removeItem("rememberMe")
          localStorage.removeItem("rememberUsername")
        }

        navigate("/dashboard")
      } else {
        setApiError(data.message || "Kullanıcı adı veya parola hatalı.")
      }
    } catch {
      setApiError("Sunucuya bağlanılamadı.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#F5F7FA" }}
    >
      <div className="relative flex w-full max-w-[860px] min-h-[540px] rounded-2xl overflow-hidden bg-white shadow-[0_24px_70px_-32px_rgba(30,58,95,0.45),0_1px_3px_rgba(15,23,42,0.08)] border border-[#E5EAF0]">
        {/* SOL PANEL */}
        <div
          className="hidden md:flex w-[42%] p-11 flex-col justify-between relative overflow-hidden"
          style={{ background: "#1E3A5F" }}
        >
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              WebkitMaskImage:
                "radial-gradient(circle at 30% 25%, black 0%, transparent 72%)",
              maskImage:
                "radial-gradient(circle at 30% 25%, black 0%, transparent 72%)",
            }}
          />

          <div
            className="absolute -left-24 top-8 w-[360px] h-[360px] rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(147,197,253,0.55) 0%, rgba(255,255,255,0.12) 38%, transparent 68%)",
            }}
          />

          <div
            className="absolute right-0 top-0 w-[70%] h-[55%] opacity-[0.16]"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 55%, transparent 100%)",
              clipPath: "polygon(100% 0%, 100% 100%, 0% 0%)",
            }}
          />
          <div
            className="absolute left-0 bottom-0 w-[70%] h-[55%] opacity-[0.14]"
            style={{
              background:
                "linear-gradient(-20deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 55%, transparent 100%)",
              clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
            }}
          />

          <div className="relative flex flex-col gap-9">
            <div className="absolute -top-10 -left8 w-[360px] h-[600px] opacity-95 pointer-events-none">
              <SmartSpiritLogo variant="watermark" className="w-full h-full" />
            </div>
          </div>

          <div className="relative mt-auto flex flex-col gap-4">


            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15" />
              <span className="font-sans text-[12px] text-blue-100/55 tracking-wide whitespace-nowrap">
                Smart Spirit © 2026
              </span>
            </div>
          </div>
        </div>

        {/* SAĞ FORM */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-10 md:p-14 bg-white"
          style={{ animation: "fade-up 0.55s ease-out both" }}
        >
          <div className="w-full max-w-[380px]">
            <div className="mb-8">
              <div className="font-sans text-[22px] font-semibold tracking-[0.04em] text-[#1E3A5F] mb-2 uppercase">
                Yetkili Girişi
              </div>
              <div className="h-px w-12 bg-[#1E3A5F]/25 mt-5" />
            </div>

            <form onSubmit={handleLogin} noValidate className="space-y-5">
              {/* Kullanıcı Adı */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="space-y-3"
              >
                <Label
                  htmlFor="username"
                  className="font-sans text-[14px] font-medium text-[#1F2937]"
                >
                  Kullanıcı adı
                </Label>

                <div
                  className={`flex items-center gap-2.5 h-12 rounded-xl border bg-[#F8FAFC] px-3.5 transition-all ${
                    errors.username
                      ? "border-destructive"
                      : "border-[#DDE3EA] focus-within:border-[#1E3A5F] focus-within:ring-4 focus-within:ring-[#1E3A5F]/10"
                  }`}
                >
                  <FieldIcon>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-[16px] h-[16px]"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="8" r="4" />
                    </svg>
                  </FieldIcon>

                  <input
                    id="username"
                    type="text"
                    placeholder="örn. admin"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (errors.username) {
                        setErrors((p) => ({ ...p, username: "" }))
                      }
                    }}
                    className="flex-1 h-full bg-transparent outline-none border-0 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]"
                    autoComplete="username"
                  />
                </div>

                <AnimatePresence>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="font-sans text-[12.5px] text-destructive"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Parola */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="space-y-3"
              >
                <Label
                  htmlFor="password"
                  className="font-sans text-[14px] font-medium text-[#1F2937]"
                >
                  Şifre
                </Label>

                <div
                  className={`flex items-center gap-2.5 h-12 rounded-xl border bg-[#F8FAFC] px-3.5 transition-all ${
                    errors.password
                      ? "border-destructive"
                      : "border-[#DDE3EA] focus-within:border-[#1E3A5F] focus-within:ring-4 focus-within:ring-[#1E3A5F]/10"
                  }`}
                >
                  <FieldIcon>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-[16px] h-[16px]"
                    >
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </FieldIcon>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors((p) => ({ ...p, password: "" }))
                      }
                    }}
                    className="flex-1 h-full bg-transparent outline-none border-0 text-[15px] text-[#111827] placeholder:text-[#9CA3AF]"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="text-[#6B7280] hover:text-[#1E3A5F] transition-colors shrink-0"
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="w-[18px] h-[18px]"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="w-[18px] h-[18px]"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="font-sans text-[12.5px] text-destructive"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Beni hatırla + şifremi unuttum */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                    className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1E3A5F] data-[state=checked]:border-[#1E3A5F] data-[state=checked]:text-white"
                  />
                  <span className="text-[13.5px] text-[#6B7280]">
                    Beni hatırla
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setApiError(
                      "Şifre sıfırlama bağlantısı için sistem yöneticinizle iletişime geçin."
                    )
                  }
                  className="text-[13.5px] font-medium text-[#1E3A5F] hover:text-[#16304D] transition-colors"
                >
                  Şifremi unuttum
                </button>
              </div>

              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="rounded-lg border border-destructive/25 bg-destructive/[0.06] px-4 py-3 text-[13.5px] text-destructive"
                  >
                    {apiError}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#1E3A5F] hover:bg-[#16304D] text-white font-semibold shadow-[0_14px_24px_-14px_rgba(30,58,95,0.9)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? "Bağlanıyor..." : "Giriş yap"}

                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                )}
              </Button>
            </form>

            <div className="mt-9 pt-6 border-t border-[#E5EAF0] text-center font-sans text-[12.5px] text-[#6B7280]">
              Smart Spirit · güvenli bağlantı ile korunmaktadır
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}