import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastProvider } from "@/components/ui/toast"
import Home from "@/pages/Home"
import Clipboard from "@/pages/Clipboard"
import "./index.css"

function App() {
  return (
      <Router>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clipboard/:code" element={<Clipboard />} />
          </Routes>
        </ToastProvider>
      </Router>
  )
}

export default App
