import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
      </Routes>
    </>
  )
}

export default App