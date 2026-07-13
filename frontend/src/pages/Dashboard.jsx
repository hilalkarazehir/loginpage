import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { FileText, Shield, Users, Clock } from "lucide-react"
import UsersPanel from "@/components/dashboard/UsersPanel"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ModuleCard from "@/components/dashboard/ModuleCard"
import LogsPanel from "@/components/dashboard/LogsPanel"
import RolesPanel from "@/components/dashboard/RolesPanel"

const MODULES = [
  {
    key: "loglar",
    title: "Loglar",
    description: "Oturum açma ve parola değişikliği .",
    icon: FileText,
    active: true,
  },
  {
    key: "roller",
    title: "Roller",
    description: "Sistemdeki rolleri görüntüleyin.",
    icon: Shield,
    active: true,
  },
  {
    key: "kullanicilar",
    title: "Kullanıcılar",
    description: "Sistemdeki kullanıcıları listeleyin ve düzenleyin.",
    icon: Users,
    active: true,
  },
]

// Backend'deki rol isimlerini (ADMIN / USER) ekranda gösterilecek
// Türkçe etikete çeviriyoruz. Yeni bir rol eklersen buraya da eklemen yeterli.
const ROLE_LABELS = {
  ADMIN: "Yönetici",
  USER: "Kullanıcı",
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("loading")
  const [expandedModule, setExpandedModule] = useState(null)

  const toggleModule = (mod) => {
    if (!mod.active) return
    setExpandedModule((current) => (current === mod.key ? null : mod.key))
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    navigate("/")
  }

  // Sayfa açılınca: token var mı, profil bilgisi çekilebiliyor mu,
  // gerekirse refresh token ile yenileme dene.
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const token = localStorage.getItem("token")

    if (isLoggedIn !== "true" || !token) {
      navigate("/")
      return
    }

    const loadProfile = (accessToken) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    }

    loadProfile(token)
      .then((res) => {
        if (res.status === 401) throw new Error("expired")
        if (!res.ok) throw new Error("other")
        return res.json()
      })
      .then((data) => {
        setUsername(data.username || "")
        setRole(data.role || "")
        setStatus("ready")
      })
      .catch((err) => {
        if (err.message === "expired") {
          // access token süresi dolmuş, refresh token ile yenilemeyi dene
          const refreshToken = localStorage.getItem("refreshToken")
          if (!refreshToken) {
            setStatus("error")
            handleLogout()
            return
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })
            .then((res) => res.json())
            .then((refreshData) => {
              if (!refreshData.success) throw new Error("refresh-failed")

              localStorage.setItem("token", refreshData.token)
              if (refreshData.refreshToken) {
                localStorage.setItem("refreshToken", refreshData.refreshToken)
              }

              return loadProfile(refreshData.token).then((res) => {
                if (!res.ok) throw new Error("still-failing")
                return res.json()
              })
            })
            .then((data) => {
              setUsername(data.username || "")
              setRole(data.role || "")
              setStatus("ready")
            })
            .catch(() => {
              setStatus("error")
              handleLogout()
            })
        } else {
          setStatus("error")
          handleLogout()
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const now = new Date()
  const loginTime = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  const roleLabel = ROLE_LABELS[role] || role

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, #17324A 0%, #1E3A5F 45%, #2A4A6B 100%)" }}
    >
      <div
        className="pointer-events-none fixed -left-32 bottom-0 w-[460px] h-[460px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147,197,253,0.65) 0%, rgba(255,255,255,0.12) 40%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none fixed -right-32 -top-40 w-[560px] h-[560px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)" }}
      />

      <DashboardHeader username={username} status={status} onLogout={handleLogout} />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative max-w-5xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
      >
        <div>
          <h1 className="font-sans text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-white">
            {status === "loading"
              ? "Yükleniyor..."
              : status === "error"
              ? "Oturum doğrulanamadı"
              : `Hoş geldin, ${username}`}
          </h1>
          <p className="mt-4 font-sans text-[14px] text-white/55">
            Panele erişiminiz doğrulandı, aşağıdaki modülleri kullanabilirsiniz.
          </p>
        </div>

        {status === "ready" && (
          <div className="relative flex gap-8 border-t md:border-t-0 md:border-l border-white/25 pt-5 md:pt-0 md:pl-8">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/40">Rol</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[15px] font-medium text-white">
                <Shield className="w-3.5 h-3.5 text-white/60" />
                {roleLabel}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/40">Son giriş</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[15px] font-medium text-white">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                Bugün, {loginTime}
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* CONTENT */}
      <main className="relative max-w-5xl mx-auto px-6 pb-16">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="h-px w-28 bg-[#D9A441] mb-6" />
              <h2 className="font-sans text-[21px] font-semibold text-white">Modüller</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {MODULES.map((mod, i) => (
              <ModuleCard
                key={mod.key}
                mod={mod}
                isOpen={expandedModule === mod.key}
                onClick={() => toggleModule(mod)}
                delay={0.1 + i * 0.08}
              />
            ))}
          </div>

          <LogsPanel isOpen={expandedModule === "loglar"} />
          <RolesPanel isOpen={expandedModule === "roller"} />
          <UsersPanel isOpen={expandedModule === "kullanicilar"} />
        </section>
      </main>
    </div>
  )
}