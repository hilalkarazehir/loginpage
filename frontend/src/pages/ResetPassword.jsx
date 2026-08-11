import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage("")

    if (!token) {
      setMessage("Geçersiz şifre sıfırlama bağlantısı.")
      setSuccess(false)
      return
    }

    if (newPassword.length < 8 || newPassword.length > 15) {
      setMessage("Şifre 8-15 karakter arasında olmalıdır.")
      setSuccess(false)
      return
    }

    if (newPassword.includes(" ")) {
      setMessage("Şifre boşluk içeremez.")
      setSuccess(false)
      return
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage("Şifre en az 1 büyük harf içermelidir.")
      setSuccess(false)
      return
    }

    if (!/[0-9]/.test(newPassword)) {
      setMessage("Şifre en az 1 rakam içermelidir.")
      setSuccess(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("Şifreler birbiriyle eşleşmiyor.")
      setSuccess(false)
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setMessage("Şifreniz başarıyla güncellendi.")

        setNewPassword("")
        setConfirmPassword("")
      } else {
        setSuccess(false)
        setMessage(
          data.message ||
          "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş."
        )
      }
    } catch {
      setSuccess(false)
      setMessage("Sunucuya bağlanılamadı.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Arka plan efektleri */}
      <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-32 -left-32" />
      <div className="absolute w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl -bottom-32 -right-32" />

      <div className="relative w-full max-w-md">

        {/* Logo / başlık */}
        <div className="text-center mb-8">

          <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#132943] border border-white/10 flex items-center justify-center shadow-xl">
            <Lock className="w-7 h-7 text-[#D9A441]" />
          </div>

          <h1 className="text-3xl font-semibold text-white">
            Şifre Sıfırlama
          </h1>

          <p className="text-sm text-white/50 mt-2">
            Hesabınız için yeni bir şifre belirleyin.
          </p>

        </div>

        {/* Kart */}
        <div className="bg-[#0d1b2d]/95 border border-white/10 rounded-3xl p-7 shadow-2xl backdrop-blur-xl">

          {!success ? (
            <form onSubmit={handleSubmit}>

              {/* Yeni şifre */}
              <div className="mb-5">

                <label className="block text-sm text-white/70 mb-2">
                  Yeni Şifre
                </label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifrenizi girin"
                    className="w-full h-12 rounded-xl bg-[#091525] border border-white/10 text-white placeholder:text-white/25 pl-11 pr-12 outline-none transition focus:border-[#D9A441]/60 focus:ring-2 focus:ring-[#D9A441]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Şifre tekrar */}
              <div className="mb-5">

                <label className="block text-sm text-white/70 mb-2">
                  Yeni Şifre Tekrar
                </label>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    className="w-full h-12 rounded-xl bg-[#091525] border border-white/10 text-white placeholder:text-white/25 pl-11 pr-12 outline-none transition focus:border-[#D9A441]/60 focus:ring-2 focus:ring-[#D9A441]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Kurallar */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 mb-5">

                <p className="text-xs text-white/40 mb-2">
                  Şifre gereksinimleri
                </p>

                <div className="space-y-1">

                  <p
                    className={`text-xs ${
                      newPassword.length >= 8 && newPassword.length <= 15
                        ? "text-green-400"
                        : "text-white/30"
                    }`}
                  >
                    • 8-15 karakter arası
                  </p>

                  <p
                    className={`text-xs ${
                      /[A-Z]/.test(newPassword)
                        ? "text-green-400"
                        : "text-white/30"
                    }`}
                  >
                    • En az 1 büyük harf
                  </p>

                  <p
                    className={`text-xs ${
                      /[0-9]/.test(newPassword)
                        ? "text-green-400"
                        : "text-white/30"
                    }`}
                  >
                    • En az 1 rakam
                  </p>

                  <p
                    className={`text-xs ${
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? "text-green-400"
                        : "text-white/30"
                    }`}
                  >
                    • Şifreler eşleşmeli
                  </p>

                </div>

              </div>

              {/* Hata / mesaj */}
              {message && !success && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300">
                    {message}
                  </p>
                </div>
              )}

              {/* Buton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#D9A441] hover:bg-[#e5b454] text-[#07111f] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Şifre güncelleniyor..."
                  : "Şifreyi Güncelle"}
              </button>

            </form>
          ) : (

            /* BAŞARILI */
            <div className="text-center py-6">

              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>

              <h2 className="text-xl font-semibold text-white mb-2">
                Şifre Güncellendi
              </h2>

              <p className="text-sm text-white/50 leading-relaxed mb-7">
                Şifreniz başarıyla değiştirildi.
                <br />
                Artık yeni şifrenizle giriş yapabilirsiniz.
              </p>

              <button
                onClick={() => navigate("/")}
                className="w-full h-12 rounded-xl bg-[#D9A441] hover:bg-[#e5b454] text-[#07111f] font-semibold transition"
              >
                Giriş Sayfasına Dön
              </button>

            </div>

          )}

        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Smart Spirit AI
        </p>

      </div>
    </div>
  )
}