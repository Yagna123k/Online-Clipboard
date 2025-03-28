import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Clipboard from "./pages/Clipboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clipboard/:code" element={<Clipboard />} />
      </Routes>
    </Router>
  );
}

export default App;
