import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

function FieldIcon({ children }) {
  return <span className="text-[#6B7280] shrink-0 flex items-center">{children}</span>
}

export default function LoginForm({ initialUsername = "", initialRememberMe = false }) {
  const [username, setUsername] = useState(initialUsername)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(initialRememberMe)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
const [forgotOpen, setForgotOpen] = useState(false)
const [forgotEmail, setForgotEmail] = useState("")
const [forgotLoading, setForgotLoading] = useState(false)
const [forgotMessage, setForgotMessage] = useState("")
const [forgotError, setForgotError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setApiError("")
     const errors = {};

       if (!username.trim()) {
         errors.username = "Kullanıcı adı boş bırakılamaz.";
       } else if (username.length > 15) {
         errors.username = "Kullanıcı adı en fazla 15 karakter olabilir.";
       } else if (username.includes(" ")) {
         errors.username = "Kullanıcı adı boşluk içeremez.";
       }

       if (!password) {
         errors.password = "Şifre boş bırakılamaz.";
       } else if (password.length < 8 || password.length > 15) {
         errors.password = "Şifre 8-15 karakter arasında olmalıdır.";
       } else if (password.includes(" ")) {
         errors.password = "Şifre boşluk içeremez.";
       } else if (!/[A-Z]/.test(password)) {
         errors.password = "Şifre en az 1 büyük harf içermelidir.";
       } else if (!/[0-9]/.test(password)) {
         errors.password = "Şifre en az 1 rakam içermelidir.";
       }
if (errors.username || errors.password) {
  setErrors(errors)
  return
}

setLoading(true)

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("token", data.token)
        localStorage.setItem("refreshToken", data.refreshToken)

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
const handleForgotPassword = async (e) => {
  e.preventDefault()

  setForgotMessage("")
  setForgotError("")

  if (!forgotEmail.trim()) {
    setForgotError("E-posta adresi boş bırakılamaz.")
    return
  }

  if (!forgotEmail.includes("@")) {
    setForgotError("Geçerli bir e-posta adresi giriniz.")
    return
  }

  setForgotLoading(true)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      setForgotMessage(
        "Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi."
      )
    } else {
      setForgotError(
        data.message || "Şifre sıfırlama işlemi gerçekleştirilemedi."
      )
    }
  } catch {
    setForgotError("Sunucuya bağlanılamadı.")
  } finally {
    setForgotLoading(false)
  }
}
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-10 md:p-14 bg-white"
      style={{ animation: "fade-up 0.55s ease-out both" }}
    >
    {forgotOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1E3A5F]">
              Şifre Sıfırlama
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Hesabınıza ait e-posta adresini girin. Şifre sıfırlama
              bağlantısını e-posta adresinize göndereceğiz.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">

            <div className="space-y-2">
              <Label
                htmlFor="forgotEmail"
                className="text-sm font-medium text-[#1F2937]"
              >
                E-posta adresi
              </Label>

              <input
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value)
                  setForgotError("")
                  setForgotMessage("")
                }}
                placeholder="ornek@mail.com"
                className="w-full h-12 rounded-xl border border-[#DDE3EA] bg-[#F8FAFC] px-4 text-sm outline-none transition-all focus:border-[#1E3A5F] focus:ring-4 focus:ring-[#1E3A5F]/10"
              />
            </div>

            {forgotError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {forgotError}
              </div>
            )}

            {forgotMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                {forgotMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() => {
                  setForgotOpen(false)
                  setForgotEmail("")
                  setForgotError("")
                  setForgotMessage("")
                }}
                className="flex-1 h-12 rounded-xl border border-[#DDE3EA] text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                disabled={forgotLoading}
                className="flex-1 h-12 rounded-xl bg-[#1E3A5F] text-sm font-semibold text-white hover:bg-[#16304D] disabled:opacity-60 transition-colors"
              >
                {forgotLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
              </button>

            </div>
          </form>
        </motion.div>
      </div>
    )}
      <div className="w-full max-w-[380px]">
        <div className="mb-8">
          <div className="font-sans text-[22px] font-semibold tracking-[0.04em] text-[#1E3A5F] mb-2 ">
            YETKİLİ GİRİŞİ
          </div>
          <div className="h-px w-45 bg-[#1E3A5F]/25 mt-2" />
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          {/* Kullanıcı Adı */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-3"
          >
            <Label htmlFor="username" className="font-sans text-[14px] font-medium text-[#1F2937]">
              Kullanıcı adı
            </Label>

            <div
              className={`flex items-center gap-2.5 h-12 rounded-xl border bg-[#F8FAFC] px-3.5 transition-all duration-200 ease-out ${
                errors.username
                  ? "border-destructive"
                  : "border-[#DDE3EA] focus-within:border-[#1E3A5F] focus-within:ring-4 focus-within:ring-[#1E3A5F]/10 focus-within:shadow-md focus-within:scale-[1.015]"
              }`}
            >
              <FieldIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
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
            <Label htmlFor="password" className="font-sans text-[14px] font-medium text-[#1F2937]">
              Şifre
            </Label>

            <div
              className={`flex items-center gap-2.5 h-12 rounded-xl border bg-[#F8FAFC] px-3.5 transition-all duration-200 ease-out ${
                errors.password
                  ? "border-destructive"
                  : "border-[#DDE3EA] focus-within:border-[#1E3A5F] focus-within:ring-4 focus-within:ring-[#1E3A5F]/10 focus-within:shadow-md focus-within:scale-[1.015]"
              }`}
            >
              <FieldIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
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
              <span className="text-[13.5px] text-[#6B7280]">Beni hatırla</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotOpen(true)
                setForgotMessage("")
                setForgotError("")
              }}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
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
  )
}