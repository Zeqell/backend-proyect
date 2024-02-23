import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProductsPage } from './pages/productsPage';
import { ProductDetailPage } from './pages/productDetailPage'

function App() {

  return (
    <Router>
      <h1>Ecommerc</h1>
      <Routes>
        <Route path='/' element={<ProductsPage/>} />   
        <Route path='/' element={<ProductDetailPage/>} />
      /</Routes>
    </Router>
  )
}

export default App
