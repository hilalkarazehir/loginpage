import { useEffect, useState } from "react"
import { History, RefreshCw, UserX, XCircle, UserCircle2, BellRing } from "lucide-react"
import ActionBadge from "@/components/dashboard/ActionBadge"
import { authFetch } from "@/lib/apiClient"

const ALERT_ACTIONS = ["LOGIN_FAILED_INVALID_CREDENTIALS", "LOGIN_BLOCKED_TOO_MANY_ATTEMPTS"]

export default function LogsPanel({ filterAlerts = false }) {
  const [logs, setLogs] = useState([])
  const [logsStatus, setLogsStatus] = useState("idle")

const fetchLogs = () => {
  setLogsStatus("loading")

  authFetch("/api/logs")
    .then((res) => {
      if (res.status === 403) {
        throw new Error("forbidden")
      }
      if (!res.ok) {
        throw new Error("error")
      }
      return res.json()
    })
    .then((data) => {
      if (data && (data.error === "Forbidden" || data.status === 403)) {
        setLogsStatus("forbidden")
        return
      }

      setLogs(Array.isArray(data) ? data : [])
      setLogsStatus("ready")
    })
    .catch((err) => {
      setLogsStatus(err.message === "forbidden" ? "forbidden" : "error")
    })
}

  useEffect(() => {
    fetchLogs()
  }, [filterAlerts])

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1B2A]/95 backdrop-blur-md shadow-[0_20px_50px_-28px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D9A441]/10 border border-[#D9A441]/25 flex items-center justify-center">
            {filterAlerts ? (
              <BellRing className="w-4 h-4 text-red-400" />
            ) : (
              <History className="w-4 h-4 text-[#D9A441]" />
            )}
          </div>
          <h3 className="text-[15px] font-semibold text-white">
            {filterAlerts ? "Sistem Güvenlik Uyarıları" : "Son Oturum Kayıtları"}
          </h3>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-white/10 hover:border-white/25 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${logsStatus === "loading" ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      <div className="p-6">
        {logsStatus === "loading" && (
          <div className="flex items-center gap-2 py-6 justify-center text-[13.5px] text-white/50">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loglar yükleniyor...
          </div>
        )}

        {logsStatus === "forbidden" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <UserX className="w-4 h-4 shrink-0" />
            Bu veriyi görüntülemek için yönetici yetkisi gerekiyor.
          </div>
        )}

        {logsStatus === "error" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <XCircle className="w-4 h-4 shrink-0" />
            Loglar yüklenirken bir hata oluştu.
          </div>
        )}

        {logsStatus === "ready" && (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-[13px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Kullanıcı
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    İşlem
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-6 text-center text-white/40">
                      {filterAlerts ? "Güvenlik uyarısı bulunmuyor." : "Kayıt bulunamadı."}
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={idx} className="group/row hover:bg-white/[0.03] transition-colors">
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <UserCircle2 className="w-3.5 h-3.5 text-white/60" />
                          </div>
                          <span className="font-medium text-white">{log.username || "Bilinmiyor"}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <ActionBadge action={log.action} />
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06] text-white/45 font-mono text-[12.5px] tabular-nums">
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
  )
}