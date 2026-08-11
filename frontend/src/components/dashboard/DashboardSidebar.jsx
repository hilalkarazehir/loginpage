import {
  LayoutGrid,
  Users,
  Shield,
  FileText,
  Gamepad2,
} from "lucide-react"

const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutGrid, label: "Dashboard" },
  { key: "users", icon: Users, label: "Kullanıcılar", adminOnly: true },
  { key: "roles", icon: Shield, label: "Roller", adminOnly: true },
  { key: "logs", icon: FileText, label: "Loglar", adminOnly: true },
  { key: "game", icon: Gamepad2, label: "Mini Game" },
]

export default function DashboardSidebar({ onSelectModule, onSelectGame, activeTab, status, alertCount = 0, isAdmin = false }) {
  const handleClick = (item) => {
    if (item.key === "game") {
      onSelectGame()
      return
    }
    // Tüm modül seçimlerini (dashboard, users, roles, logs, alerts) parent'a bildir
    onSelectModule(item.key)
  }

  // Kullanıcılar, Roller ve Loglar sadece ADMIN rolüne gösterilir; bu sayfalar
  // zaten backend tarafında hasRole("ADMIN") ile korunuyor, burada sadece
  // menüde görünmemelerini sağlıyoruz.
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  return (
    <aside className="hidden md:flex sticky top-16 h-[calc(100vh-4rem)] w-52 shrink-0 flex-col border-r border-white/10 bg-black/20 p-3">
      <div className="px-3 py-4 border-b border-white/10 mb-3">
        <h2 className="text-lg font-semibold text-white">Menü</h2>
      </div>

      <div className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const showBadge = item.key === "alerts" && alertCount > 0
          const isActive = activeTab === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleClick(item)}
              className={`
                group relative flex w-full items-center justify-between
                rounded-xl px-4 py-3 border text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white/10 border-[#D9A441]/40 text-[#D9A441] shadow-lg shadow-black/20"
                    : "border-transparent text-white/65 hover:bg-white/5 hover:border-[#D9A441]/20 hover:text-[#D9A441] hover:translate-x-1"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#D9A441]" : ""}`} />
                <span>{item.label}</span>
              </div>

              {showBadge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/80 px-1.5 text-[11px] font-bold text-white">
                  {alertCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}