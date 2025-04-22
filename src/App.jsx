import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import FakePayment from './pages/FakePayment';
import ThankYou from './pages/ThankYou';
import 'react-toastify/dist/ReactToastify.css';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

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
        <Route path="/details" element={
          <ProtectedRoute>
            <FakePayment />
          </ProtectedRoute>
        } />
        <Route path="/thank-you" element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;