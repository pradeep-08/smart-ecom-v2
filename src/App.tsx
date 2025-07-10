import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { CouponProvider } from "@/contexts/CouponContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { WaitlistProvider } from "@/contexts/WaitlistContext";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminHome from "@/pages/admin/AdminHome";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <ProductProvider>
              <CouponProvider>
                <CartProvider>
                  <OrderProvider>
                    <ReviewProvider>
                      <WaitlistProvider>
                        <Routes>
                          <Route path="/" element={<Layout><Home /></Layout>} />
                          <Route path="/products" element={<Layout><ProductList /></Layout>} />
                          <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
                          <Route path="/cart" element={<Layout><Cart /></Layout>} />
                          <Route path="/checkout" element={
                            <RequireAuth allowedRoles={["user", "admin"]}>
                              <Layout><Checkout /></Layout>
                            </RequireAuth>
                          } />
                          <Route path="/orders" element={
                            <RequireAuth allowedRoles={["user", "admin"]}>
                              <Layout><Orders /></Layout>
                            </RequireAuth>
                          } />
                          <Route path="/orders/:id" element={
                            <RequireAuth allowedRoles={["user", "admin"]}>
                              <Layout><OrderDetail /></Layout>
                            </RequireAuth>
                          } />
                          <Route path="/login" element={<Layout><Login /></Layout>} />
                          <Route path="/register" element={<Layout><Register /></Layout>} />
                          <Route path="/admin" element={
                            <RequireAuth allowedRoles={["admin"]}>
                              <AdminDashboard />
                            </RequireAuth>
                          }>
                            <Route index element={<AdminHome />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="coupons" element={<AdminCoupons />} />
                          </Route>
                          <Route path="*" element={<Layout><NotFound /></Layout>} />
                        </Routes>
                      </WaitlistProvider>
                    </ReviewProvider>
                  </OrderProvider>
                </CartProvider>
              </CouponProvider>
            </ProductProvider>
          </AuthProvider>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
