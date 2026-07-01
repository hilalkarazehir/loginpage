import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPages from "./pages/LoginPages"
import Dashboard from "./pages/Dashboard"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPages />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App