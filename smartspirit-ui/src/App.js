import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginEkrani from "./pages/LoginEkrani"
import Dashboard from "./pages/Dashboard"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginEkrani />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App