import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, #2d0a5e 0%, #0d0620 40%, #000008 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif", color: "#f3e8ff"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1>Hoşgeldiniz</h1>
        <p style={{ color: "rgba(196,132,252,0.7)" }}>Smart Spirit Dashboard</p>
        <button onClick={handleLogout} style={{
          marginTop: 20, padding: "12px 24px", border: "none", borderRadius: 12,
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700
        }}>
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

export default Dashboard