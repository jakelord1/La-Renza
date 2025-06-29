import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { RequireAuth, RedirectIfAuth } from './components/RequireAuth';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import Account from './components/Account';
import Catalog from './components/Catalog';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import PromoBanner from './components/PromoBanner';
import ProductDetailsWrapper from './components/ProductDetailsWrapper.jsx';
import NotFound from './components/NotFound';
import { 
  AdminLogin,
  AdminLayout,
  Dashboard,
  Comments,
  Coupons,
  Users,
  Categories,
  Sizes,
  Images,
  Addresses,
  Orders,
  DeliveryMethods,
  Colors,
  Products,
  Models
} from './components/admin';
import Configurator from './components/admin/Configurator';
import Administrators from './components/admin/Administrators';
import Invoices from './components/admin/Invoices';
import './App.css';
import { BannerProvider } from './components/BannerContext';

function App() {
  return (
    <BannerProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="configurator" element={<Configurator />} />
            <Route path="orders" element={<Orders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="comments" element={<Comments />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="delivery-methods" element={<DeliveryMethods />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="images" element={<Images />} />
            <Route path="administrators" element={<Administrators />} />
            <Route path="colors" element={<Colors />} />
            <Route path="products" element={<Products />} />
            <Route path="models" element={<Models />} />
          </Route>
          
          <Route path="*" element={
            <>
              <PromoBanner />
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={
  <RedirectIfAuth>
    <LoginForm />
  </RedirectIfAuth>
} />
<Route path="/register" element={
  <RedirectIfAuth>
    <RegisterForm />
  </RedirectIfAuth>
} />
                  <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                  <Route path="/catalog" element={<Catalog />} />
<Route path="/catalog/category/:categoryId" element={<Catalog />} />
                  <Route path="/account/*" element={
  <RequireAuth>
    <Account />
  </RequireAuth>
} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/product/:id" element={<ProductDetailsWrapper />} />
                  {/* <Route path="/reset-password/:token" element={<ResetPasswordForm />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
    </BannerProvider>
  );
}

export default App;
