import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPages from "./pages/LoginPages"
import Dashboard from "./pages/Dashboard"
import MiniGamePage from "./pages/MiniGamePage"
import "./App.css"
import ResetPassword from "./pages/ResetPassword"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPages />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game" element={<MiniGamePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App