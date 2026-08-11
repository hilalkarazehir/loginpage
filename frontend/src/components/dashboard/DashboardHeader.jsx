import { LogOut, UserCircle2 } from "lucide-react"

export default function DashboardHeader({ username, status, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08111C]/85 backdrop-blur-xl">
          <div className="w-full px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[16px] font-bold tracking-[0.06em] text-white uppercase"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
          >
            Smart Spirit
          </span>
          <span
            className="text-[16px] font-bold tracking-[0.06em] uppercase bg-gradient-to-r from-[#F4D27A] to-[#D9A441] bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
          >
            AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {status === "ready" && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 pl-2 pr-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <UserCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-medium text-white">{username}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/10 hover:border-white/25 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white/70" />
            <span className="hidden sm:inline">Çıkış yap</span>
          </button>
        </div>
      </div>
    </header>
  )
}