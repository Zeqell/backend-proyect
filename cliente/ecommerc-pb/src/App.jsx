import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductPages from './pages/ProductPages'
import TopNavbar from './components/Navbar/TopNavbar'

function App() {

  return (
      <BrowserRouter>
        <TopNavbar />
        <Routes>
          <Route path='/' element={<ProductPages />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App