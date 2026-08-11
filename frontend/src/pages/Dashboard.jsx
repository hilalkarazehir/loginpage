import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Shield, Clock } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import { authFetch } from "@/lib/apiClient"
import UsersPanel from "@/components/dashboard/UsersPanel"
import LogsPanel from "@/components/dashboard/LogsPanel"
import RolesPanel from "@/components/dashboard/RolesPanel"

const ROLE_LABELS = {
  ADMIN: "Yönetici",
  USER: "Kullanıcı",
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("loading")
  const [activeTab, setActiveTab] = useState("dashboard") // Varsayılan sekme

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    navigate("/")
  }
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const token = localStorage.getItem("token")

    if (isLoggedIn !== "true" || !token) {
      navigate("/")
      return
    }

    authFetch("/api/users/profile")
      .then((res) => {
        if (!res.ok) throw new Error("profile-fetch-failed")
        return res.json()
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
  }, [navigate])

  const now = new Date()
  const loginTime = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  const roleLabel = ROLE_LABELS[role] || role
  const isAdmin = role.toUpperCase() === "ADMIN"

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, #060B12 0%, #0B1C2E 45%, #13293F 100%)" }}
    >
      {/* Glow Effects */}
      <div
        className="pointer-events-none fixed -left-32 bottom-0 w-[460px] h-[460px] rounded-full opacity-[0.10] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(147,197,253,0.5) 0%, rgba(255,255,255,0.08) 40%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none fixed -right-32 -top-40 w-[560px] h-[560px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)" }}
      />

      <DashboardHeader username={username} status={status} onLogout={handleLogout} />

      <div className="relative flex">
        <DashboardSidebar
          activeTab={activeTab}
          onSelectModule={(tabKey) => setActiveTab(tabKey)}
          onSelectGame={() => navigate("/game")}
          status={status}
          isAdmin={isAdmin}
        />

        {/* ANA İÇERİK ALANI */}
        <main className="flex-1 min-w-0 px-8 py-8 md:py-10">
          <div className="max-w-5xl space-y-8">

            {/* HOŞ GELDİN HEADER (Tüm sekmelerde sabit kalır) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/10"
            >
              <div>
                <h1
                  className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
                  style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
                >
                  {status === "loading" ? (
                    "Yükleniyor..."
                  ) : status === "error" ? (
                    "Oturum doğrulanamadı"
                  ) : (
                    <>
                      Hoş geldin,{" "}
                      <span className="bg-gradient-to-r from-[#F4D27A] to-[#D9A441] bg-clip-text text-transparent">
                        {username}
                      </span>
                    </>
                  )}
                </h1>
              </div>

              {status === "ready" && (
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Rol</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      {roleLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Son Giriş</div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white">
                      <Clock className="w-4 h-4 text-white/60" />
                      Bugün, {loginTime}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

           {/* DİNAMİK İÇERİK ALANI: HERO DASHBOARD */}
           {activeTab === "dashboard" && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E1A29] via-[#0B1624] to-[#08111C] p-8 md:p-10 shadow-2xl">
                 {/* Arka Plan Glow Efektleri */}
                 <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#D9A441]/10 blur-[100px]" />
                 <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

                 <div className="relative z-10 flex flex-col justify-between gap-6">
                   <div>
                     <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1">
                       <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                       <span className="text-xs font-medium text-emerald-300">Sistem Aktif</span>
                     </div>
                   </div>

                   {/* Dinamik Başlık ve Metin (Tam genişlik) */}
                   <div className="max-w-3xl space-y-3">
                     <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                       Smart Spirit AI Yönetim Paneli
                     </h2>
                     <p className="text-sm md:text-base text-white/60 leading-relaxed">
                       {isAdmin
                         ? <>Yönetici yetkisiyle oturum açtınız.
                         <br/>
                         Sol menü üzerinden kullanıcıları yönetebilir, rol tanımlamaları yapabilir ve sistem loglarını izleyebilirsiniz.
                         </>
                         : "Sistem modüllerine ve erişebildiğiniz servislere sol taraftaki menüyü kullanarak anında ulaşabilirsiniz."
                       }
                     </p>
                   </div>

                   {/* Alt Aksiyon Alanı */}
                   <div className="pt-2 flex items-center gap-4">
                     <button
                       onClick={() => navigate("/game")}
                       className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F4D27A] to-[#D9A441] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#D9A441]/10"
                     >
                       <span>Mini Game'e Git</span>
                     </button>

                     <span className="text-xs text-white/40 border-l border-white/10 pl-4 py-1">
                     </span>
                   </div>
                 </div>
               </div>
             </motion.div>
           )}

            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <UsersPanel currentUsername={username} />
              </motion.div>
            )}

            {activeTab === "roles" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <RolesPanel />
              </motion.div>
            )}

            {activeTab === "logs" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <LogsPanel />
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}