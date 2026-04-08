import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { AdminRoute, UserRoute } from "../components/ProtectedRoute";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ProductDetails from "../pages/public/ProductDetails";

import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Profile from "../pages/user/Profile";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import ProductForm from "../pages/admin/ProductForm";
import Orders from "../pages/admin/Orders";
import Categories from "../pages/admin/Categories";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      {/* User protected */}
      <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
      <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
      <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
    </Route>

    {/* Admin protected */}
    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="orders" element={<Orders />} />
      <Route path="categories" element={<Categories />} />
    </Route>
  </Routes>
);

export default AppRoutes;
