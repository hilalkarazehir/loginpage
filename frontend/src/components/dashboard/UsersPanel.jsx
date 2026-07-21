import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Users, RefreshCw, UserX, XCircle } from "lucide-react"

export default function UsersPanel({ isOpen }) {
  const [users, setUsers] = useState([])
  const [usersStatus, setUsersStatus] = useState("idle")

  const fetchUsers = () => {
    const token = localStorage.getItem("token")
    setUsersStatus("loading")

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) throw new Error("forbidden")
        if (!res.ok) throw new Error("error")
        return res.json()
      })
      .then((data) => {
        setUsers(data)
        setUsersStatus("ready")
      })
      .catch((err) => {
        setUsersStatus(err.message === "forbidden" ? "forbidden" : "error")
      })
  }

  useEffect(() => {
    if (isOpen) fetchUsers()
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
                  <Users className="w-4 h-4 text-[#1E3A5F]" />
                </div>
                <h3 className="font-sans text-[15px] font-semibold text-[#111827]">
                  Sistem kullanıcıları
                </h3>
              </div>
            </div>

            <div className="p-6">
              {usersStatus === "loading" && (
                <div className="flex items-center gap-2 py-6 justify-center text-[13.5px] text-[#6B7280]">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Kullanıcılar yükleniyor...
                </div>
              )}

              {usersStatus === "forbidden" && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <UserX className="w-4 h-4 shrink-0" />
                  Bu veriyi görüntülemek için yönetici yetkisi gerekiyor.
                </div>
              )}

              {usersStatus === "error" && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <XCircle className="w-4 h-4 shrink-0" />
                  Kullanıcılar yüklenirken bir hata oluştu.
                </div>
              )}

              {usersStatus === "ready" && (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-left text-[13px] border-separate border-spacing-0">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">Kullanıcı adı</th>
                        <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">Ad Soyad</th>
                        <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-[#9AA4B2]">Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-2 py-6 text-center text-[#6B7280]">
                            Kayıt bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="group/row hover:bg-[#FAFBFC] transition-colors">
                            <td className="px-2 py-3 border-t border-[#F3F5F8] font-medium text-[#111827]">{u.username}</td>
                            <td className="px-2 py-3 border-t border-[#F3F5F8] text-[#374151]">{u.fullName || "-"}</td>
                            <td className="px-2 py-3 border-t border-[#F3F5F8]">
                              <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium bg-[#EEF3F8] text-[#1E3A5F] border-[#DDE6F0]">
                                {u.role}
                              </span>
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