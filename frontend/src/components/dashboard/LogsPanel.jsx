import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { History, RefreshCw, UserX, XCircle, UserCircle2 } from "lucide-react"
import ActionBadge from "@/components/dashboard/ActionBadge"

export default function LogsPanel({ isOpen }) {
  const [logs, setLogs] = useState([])
  const [logsStatus, setLogsStatus] = useState("idle")

  const fetchLogs = () => {
    const token = localStorage.getItem("token")
    setLogsStatus("loading")

    fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
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

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
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
                <RefreshCw className={`w-3.5 h-3.5 ${logsStatus === "loading" ? "animate-spin" : ""}`} />
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
                          <tr key={idx} className="group/row hover:bg-[#FAFBFC] transition-colors">
                            <td className="px-2 py-3 border-t border-[#F3F5F8]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#EEF3F8] flex items-center justify-center shrink-0">
                                  <UserCircle2 className="w-3.5 h-3.5 text-[#1E3A5F]" />
                                </div>
                                <span className="font-medium text-[#111827]">{log.username}</span>
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
  )
}