import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StoreDetail from './pages/StoreDetail'
import Stamp from './pages/Stamp'
import VisitDiary from "./pages/VisitDiary";
import JiroMap from "./pages/JiroMap";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/Stamp" element={<Stamp />} /> 
        <Route path="/diary" element={<VisitDiary />} />
        <Route path="/map" element={<JiroMap />} />
      </Routes>
    </Router>
  )
}
