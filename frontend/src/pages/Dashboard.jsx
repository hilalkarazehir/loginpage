import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  LogOut,
  FileText,
  Shield,
  Users,
  ArrowRight,
  Clock,
  UserCircle2,
} from "lucide-react"
import SmartSpiritLogo from "@/components/SmartSpiritLogo"

const MODULES = [
  {
    key: "loglar",
    title: "Loglar",
    description: "Oturum açma ve parola değişikliği .",
    icon: FileText,
  },
  {
    key: "roller",
    title: "Roller",
    description: "Kullanıcı rollerini görüntüleyin ve yetkilerini yönetin.",
    icon: Shield,
  },
  {
    key: "kullanicilar",
    title: "Kullanıcılar",
    description: "Sistemdeki kullanıcıları listeleyin ve düzenleyin.",
    icon: Users,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const token = localStorage.getItem("token")

    if (isLoggedIn !== "true" || !token) {
      navigate("/")
      return
    }

    fetch("http://localhost:8080/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token geçersiz")
        return res.json()
      })
      .then((data) => {
        setUsername(data.username || "")
        setStatus("ready")
      })
      .catch(() => {
        setStatus("error")
        handleLogout()
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("token")
    navigate("/")
  }

  const now = new Date()
  const loginTime = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1E3A5F] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        className="pointer-events-none fixed -right-32 -top-40 w-[560px] h-[560px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147,197,253,0.65) 0%, rgba(255,255,255,0.12) 40%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none fixed -left-32 bottom-0 w-[460px] h-[460px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)",
        }}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1E3A5F]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <SmartSpiritLogo variant="mark" className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === "ready" && (
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 pl-2 pr-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                  <UserCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[13px] font-medium text-white">
                  {username}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[13.5px] font-medium text-white transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              Çıkış yap
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative max-w-5xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
      >
        <div>
          <h1 className="font-sans text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-white">
            {status === "loading"
              ? "Yükleniyor..."
              : status === "error"
              ? "Oturum doğrulanamadı"
              : `Hoş geldin, ${username}`}
          </h1>
          <p className="mt-2 font-sans text-[14px] text-white/55">
            Panele erişiminiz doğrulandı, aşağıdaki modülleri kullanabilirsiniz.
          </p>
        </div>

        {status === "ready" && (
          <div className="relative flex gap-8 border-t md:border-t-0 md:border-l border-white/15 pt-5 md:pt-0 md:pl-8">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/40">
                Rol
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[15px] font-medium text-white">
                <Shield className="w-3.5 h-3.5 text-white/60" />
                Yönetici
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/40">
                Son giriş
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[15px] font-medium text-white">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                Bugün, {loginTime}
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* CONTENT  */}
      <main className="relative max-w-5xl mx-auto px-6 pb-16">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="h-px w-12 bg-white/25 mb-4" />
              <h2 className="font-sans text-[21px] font-semibold text-white">
                Modüller
              </h2>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="group rounded-2xl border border-[#DDE3EA] bg-white p-6 shadow-[0_20px_50px_-28px_rgba(4,15,30,0.65)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_65px_-30px_rgba(4,15,30,0.75)]"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#EEF3F8] text-[#1E3A5F] border border-[#DDE6F0] transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white">
                  <mod.icon className="w-5 h-5" />
                </div>

                <h3 className="font-sans text-[16px] font-semibold text-[#111827]">
                  {mod.title}
                </h3>

                <p className="font-sans text-[13.5px] text-[#6B7280] mt-2 leading-relaxed">
                  {mod.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
                  <span className="inline-flex items-center rounded-full bg-[#EEF3F8] px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase text-[#1E3A5F]/60">
                    Yakında
                  </span>

                  <span className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] flex items-center justify-center text-[#1E3A5F]/40 transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}