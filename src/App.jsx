import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StoreDetail from './pages/StoreDetail'
import Stamp from './pages/Stamp'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/Stamp" element={<Stamp />} /> 
      </Routes>
    </Router>
  )
}
