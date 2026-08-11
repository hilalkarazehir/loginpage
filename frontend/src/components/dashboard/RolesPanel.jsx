import { useEffect, useState } from "react"
import { Shield, RefreshCw, UserX, XCircle, Plus, Pencil, Trash2 } from "lucide-react"
import { authFetch } from "@/lib/apiClient"
import RoleFormModal from "./RoleFormModal"
import ConfirmDialog from "./ConfirmDialog"

export default function RolesPanel() {
  const PROTECTED_ROLE_NAMES = ["ADMIN", "USER"]
  const isProtected = (roleName) => PROTECTED_ROLE_NAMES.includes((roleName || "").toUpperCase())

  const [roles, setRoles] = useState([])
  const [rolesStatus, setRolesStatus] = useState("idle")

  const [formOpen, setFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null) // null = yeni rol

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState("")

  const fetchRoles = () => {
    setRolesStatus("loading")

    authFetch("/api/roles")
      .then((res) => {
        if (res.status === 403) throw new Error("forbidden")
        if (!res.ok) throw new Error("error")
        return res.json()
      })
      .then((data) => {
        setRoles(data || [])
        setRolesStatus("ready")
      })
      .catch((err) => {
        setRolesStatus(err.message === "forbidden" ? "forbidden" : "error")
      })
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const openCreate = () => {
    setEditingRole(null)
    setActionError("")
    setFormOpen(true)
  }

  const openEdit = (role) => {
    setEditingRole(role)
    setActionError("")
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    setEditingRole(null)
    fetchRoles()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setActionError("")
    try {
      const res = await authFetch(`/api/roles/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => null)
        setActionError(data?.message || "Rol silinemedi.")
        setDeleting(false)
        return
      }
      setDeleteTarget(null)
      setDeleting(false)
      fetchRoles()
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
            <Shield className="w-4 h-4 text-[#D9A441]" />
          </div>
          <h3 className="text-[15px] font-semibold text-white">
            Sistem Rolleri
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#F4D27A] to-[#D9A441] px-3 py-1.5 text-[12.5px] font-semibold text-slate-950 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Rol
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

        {rolesStatus === "loading" && (
          <div className="flex items-center gap-2 py-6 justify-center text-[13.5px] text-white/50">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Roller yükleniyor...
          </div>
        )}

        {rolesStatus === "forbidden" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <UserX className="w-4 h-4 shrink-0" />
            Bu veriyi görüntülemek için yönetici yetkisi gerekiyor.
          </div>
        )}

        {rolesStatus === "error" && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-[13.5px] text-red-300">
            <XCircle className="w-4 h-4 shrink-0" />
            Roller yüklenirken bir hata oluştu.
          </div>
        )}

        {rolesStatus === "ready" && (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-[13px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    ID
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40">
                    Rol Adı
                  </th>
                  <th className="px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-white/40 text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-6 text-center text-white/40">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id || role.name} className="group/row hover:bg-white/[0.03] transition-colors">
                      <td className="px-2 py-3 border-t border-white/[0.06] text-white/45 font-mono text-[12.5px]">
                        {role.id ?? "-"}
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium bg-[#D9A441]/10 text-[#D9A441] border-[#D9A441]/25">
                          <Shield className="w-3.5 h-3.5" />
                          {role.name || role}
                        </span>
                      </td>
                      <td className="px-2 py-3 border-t border-white/[0.06]">
                        <div className="flex items-center justify-end gap-1.5">
                          {isProtected(role.name) ? (
                            <span className="text-[11px] text-white/30 italic pr-1">Sistem rolü</span>
                          ) : (
                            <>
                              <button
                                onClick={() => openEdit(role)}
                                title="Düzenle"
                                className="w-7 h-7 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-[#D9A441] hover:border-[#D9A441]/30 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setActionError(""); setDeleteTarget(role) }}
                                title="Sil"
                                className="w-7 h-7 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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

      <RoleFormModal
        open={formOpen}
        role={editingRole}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Rolü sil"
        message={deleteTarget ? `"${deleteTarget.name}" rolünü silmek istediğine emin misin? Bu role sahip kullanıcı varsa silme işlemi engellenir.` : ""}
        confirmLabel="Sil"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
