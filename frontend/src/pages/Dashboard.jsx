import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {LogOut,FileText,Shield,Users,ArrowRight, Clock,UserCircle2, ChevronDown, RefreshCw, CheckCircle2,XCircle,UserX, History,} from "lucide-react"


const ACTION_META = {
  LOGIN_SUCCESS: {
    label: "Giriş başarılı",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  LOGIN_FAILED_INVALID_CREDENTIALS: {
    label: "Hatalı kullanıcı adı / şifre",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  LOGIN_FAILED_INACTIVE_ACCOUNT: {
    label: "Hesap aktif değil",
    icon: UserX,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
}

function ActionBadge({ action }) {
  const meta = ACTION_META[action] || {
    label: action,
    icon: History,
    className: "bg-[#F3F5F8] text-[#4B5563] border-[#E5EAF0]",
  }
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${meta.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  )
}

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

  const [expandedModule, setExpandedModule] = useState(null)
  const [logs, setLogs] = useState([])
  const [logsStatus, setLogsStatus] = useState("idle") // idle | loading | ready | error | forbidden

  const fetchLogs = () => {
    const token = localStorage.getItem("token")
    setLogsStatus("loading")

    fetch("http://localhost:8080/api/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("forbidden")
        if (!res.ok) throw new Error("error")
        return res.json()
      })
      .then((data) => {
        setLogs(data)
        setLogsStatus("ready")
      })
      .catch((err) => {
        setLogsStatus(err.message === "forbidden" ? "forbidden" : "error")
      })
  }

  const toggleModule = (mod) => {
    if (!mod.active) return

    const isOpening = expandedModule !== mod.key
    setExpandedModule(isOpening ? mod.key : null)

    if (isOpening && mod.key === "loglar") {
      fetchLogs()
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const token = localStorage.getItem("token")

    if (isLoggedIn !== "true" || !token) {
      navigate("/")
      return
    }

    const loadProfile = (accessToken) => {
      return fetch("http://localhost:8080/api/users/profile", {
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

          fetch("http://localhost:8080/api/auth/refresh", {
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
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    navigate("/")
  }

  const now = new Date()
  const loginTime = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
   <div
     className="relative min-h-screen overflow-hidden text-white"
     style={{
       background:
               "linear-gradient(160deg, #17324A 0%, #1E3A5F 45%, #2A4A6B 100%)",
     }}
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
        style={{
          background:
            "radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)",
        }}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1E3A5F]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
  <div className="flex items-center gap-3">
              <span className="font-sans text-[15px] font-semibold tracking-[0.08em] text-white uppercase">
                Smart Spirit AI
              </span>
            </div>

          <div className="flex items-center gap-4">
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
              <div className="h-px w-28 bg-[#D9A441] mb-6" />
              <h2 className="font-sans text-[21px] font-semibold text-white">
                Modüller
              </h2>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {MODULES.map((mod, i) => {
              const isOpen = expandedModule === mod.key
              return (
                <motion.div
                  key={mod.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  onClick={() => toggleModule(mod)}
                  className={`group rounded-2xl border border-[#DDE3EA] bg-white p-6 shadow-[0_20px_50px_-28px_rgba(4,15,30,0.65)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_65px_-30px_rgba(4,15,30,0.75)] ${
                    mod.active ? "cursor-pointer" : ""
                  } ${isOpen ? "ring-2 ring-[#1E3A5F]/30" : ""}`}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#EEF3F8] text-[#1E3A5F] border border-[#DDE6F0] border-b-2 border-b-[#D9A441]/50 transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white group-hover:border-b-[#D9A441]">
                    <mod.icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-sans text-[16px] font-semibold text-[#111827]">
                    {mod.title}
                  </h3>

                  <p className="font-sans text-[13.5px] text-[#6B7280] mt-2 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
                    {mod.active ? (
                      <span className="inline-flex items-center rounded-full bg-[#1E3A5F]/10 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase text-[#1E3A5F] border border-[#D9A441]/40">
                        Görüntüle
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#EEF3F8] px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase text-[#1E3A5F]/60">
                        Yakında
                      </span>
                    )}

                    <span className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] flex items-center justify-center text-[#1E3A5F]/40 transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white">
                      {mod.active ? (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* LOGLAR PANELİ */}
          <AnimatePresence>
            {expandedModule === "loglar" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-2xl border border-[#DDE3EA] bg-white shadow-[0_20px_50px_-28px_rgba(4,15,30,0.65)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEF2F6] bg-[#FAFBFC]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                        <History className="w-4 h-4 text-[#1E3A5F]" />
                      </div>
                      <h3 className="font-sans text-[15px] font-semibold text-[#111827]">
                        Son oturum kayıtları
                      </h3>
                    </div>
                    <button
                      onClick={fetchLogs}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5EAF0] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#1E3A5F] hover:bg-[#F8FAFC] hover:border-[#DDE6F0] transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${logsStatus === "loading" ? "animate-spin" : ""}`}
                      />
                      Yenile
                    </button>
                  </div>

                  <div className="p-6">
                    {logsStatus === "loading" && (
                      <div className="flex items-center gap-2 py-6 justify-center text-[13.5px] text-[#6B7280]">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loglar yükleniyor...
                      </div>
                    )}

                    {logsStatus === "forbidden" && (
                      <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                        <UserX className="w-4 h-4 shrink-0" />
                        Bu veriyi görüntülemek için yönetici yetkisi gerekiyor.
                      </div>
                    )}

                    {logsStatus === "error" && (
                      <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                        <XCircle className="w-4 h-4 shrink-0" />
                        Loglar yüklenirken bir hata oluştu.
                      </div>
                    )}

                    {logsStatus === "ready" && (
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-left text-[13px] border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">
                                Kullanıcı
                              </th>
                              <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">
                                İşlem
                              </th>
                              <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">
                                Tarih
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {logs.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="px-2 py-6 text-center text-[#6B7280]">
                                  Kayıt bulunamadı.
                                </td>
                              </tr>
                            ) : (
                              logs.map((log, idx) => (
                                <tr
                                  key={idx}
                                  className="group/row hover:bg-[#FAFBFC] transition-colors"
                                >
                                  <td className="px-2 py-3 border-t border-[#F3F5F8]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-[#EEF3F8] flex items-center justify-center shrink-0">
                                        <UserCircle2 className="w-3.5 h-3.5 text-[#1E3A5F]" />
                                      </div>
                                      <span className="font-medium text-[#111827]">
                                        {log.username}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-3 border-t border-[#F3F5F8]">
                                    <ActionBadge action={log.action} />
                                  </td>
                                  <td className="px-2 py-3 border-t border-[#F3F5F8] text-[#6B7280] font-mono text-[12.5px] tabular-nums">
                                    {new Date(log.createdDate).toLocaleString("tr-TR")}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  )
}