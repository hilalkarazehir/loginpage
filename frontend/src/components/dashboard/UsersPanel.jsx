import { useEffect, useState } from "react"
import { Users, RefreshCw, UserX, XCircle, Plus, Pencil, Trash2 } from "lucide-react"
import { authFetch } from "@/lib/apiClient"
import UserFormModal from "./UserFormModal"
import ConfirmDialog from "./ConfirmDialog"

export default function UsersPanel({ currentUsername }) {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [usersStatus, setUsersStatus] = useState("idle")

  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null) // null = yeni kullanıcı

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState("")

  const fetchUsers = () => {
    setUsersStatus("loading")
    Promise.all([
      authFetch("/api/admin/users").then((res) => {
        if (res.status === 403) throw new Error("forbidden")
        if (!res.ok) throw new Error("error")
        return res.json()
      }),
      authFetch("/api/roles").then((res) => {
        if (!res.ok) throw new Error("error")
        return res.json()
      }),
    ])
      .then(([usersData, rolesData]) => {
        setUsers(usersData || [])
        setRoles(rolesData || [])
        setUsersStatus("ready")
      })
      .catch((err) => {
        setUsersStatus(err.message === "forbidden" ? "forbidden" : "error")
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openCreate = () => {
    setEditingUser(null)
    setActionError("")
    setFormOpen(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setActionError("")
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    setEditingUser(null)
    fetchUsers()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setActionError("")
    try {
      const res = await authFetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => null)
        setActionError(data?.message || "Kullanıcı silinemedi.")
        setDeleting(false)
        return
      }
      setDeleteTarget(null)
      setDeleting(false)
      fetchUsers()
    } catch {
      setActionError("Sunucuya ulaşılamadı.")
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E1B2A]/95 backdrop-blur-md shadow-[0_20px_50px_-28px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D9A441]/10 border border-[#D9A441]/25 flex items-center justify-center">
            <Users className="w-4 h-4 text-[#D9A441]" />
          </div>
          <h3 className="text-[15px] font-semibold text-white">
            Sistem Kullanıcıları
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#F4D27A] to-[#D9A441] px-3 py-1.5 text-[12.5px] font-semibold text-slate-950 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6">
        {actionError && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <XCircle className="w-4 h-4 shrink-0" />
            {actionError}
          </div>
        )}

        {usersStatus === "loading" && (
          <div className="flex items-center gap-2 py-6 justify-center text-[13.5px] text-white/50">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Kullanıcılar yükleniyor...
          </div>
        )}

        {usersStatus === "forbidden" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <UserX className="w-4 h-4 shrink-0" />
            Bu veriyi görüntülemek için yönetici yetkisi gerekiyor.
          </div>
        )}

        {usersStatus === "error" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <XCircle className="w-4 h-4 shrink-0" />
            Kullanıcılar yüklenirken bir hata oluştu.
          </div>
        )}

        {usersStatus === "ready" && (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-[13px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Kullanıcı Adı
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Ad Soyad
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Rol
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40 text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-2 py-6 text-center text-white/40">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id || idx} className="group/row hover:bg-white/[0.03] transition-colors">
                      <td className="px-2 py-3 border-t border-white/[0.06] font-medium text-white">
                        {u.username}
                        {u.username === currentUsername && (
                          <span className="ml-2 inline-block rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10.5px] font-normal text-white/40 align-middle">
                            Sen
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06] text-white/60">
                        {u.fullName || "-"}
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium bg-[#D9A441]/10 text-[#D9A441] border-[#D9A441]/25">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(u)}
                            title="Düzenle"
                            className="w-7 h-7 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-[#D9A441] hover:border-[#D9A441]/30 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setActionError(""); setDeleteTarget(u) }}
                            disabled={u.username === currentUsername}
                            title={u.username === currentUsername ? "Kendi hesabını silemezsin" : "Sil"}
                            className="w-7 h-7 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/15 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        open={formOpen}
        user={editingUser}
        roles={roles}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Kullanıcıyı sil"
        message={deleteTarget ? `"${deleteTarget.username}" kullanıcısını silmek istediğine emin misin? Bu işlem geri alınamaz.` : ""}
        confirmLabel="Sil"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
