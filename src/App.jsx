import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ページコンポーネントのインポート
import Home from './pages/Home'
import StoreDetail from './pages/StoreDetail'
import Search from './pages/Search'
import Stamp from './pages/Stamp'
import RecordForm from './pages/RecordForm'
import RecordList from './pages/RecordList'
import Blog from './pages/Blog'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/stamp" element={<Stamp />} />
        <Route path="/record" element={<RecordForm />} />
        <Route path="/records" element={<RecordList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
