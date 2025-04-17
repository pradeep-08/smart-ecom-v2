
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CouponProvider } from "./contexts/CouponContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <CouponProvider>
              <CartProvider>
                <OrderProvider>
                  <ReviewProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Layout><Outlet /></Layout>}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="cart" element={<Cart />} />
                        
                        {/* Protected User Routes */}
                        <Route element={<RequireAuth />}>
                          <Route path="checkout" element={<Checkout />} />
                          <Route path="orders" element={<Orders />} />
                          <Route path="orders/:id" element={<OrderDetail />} />
                        </Route>
                      </Route>
                      
                      {/* Admin Routes */}
                      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                        <Route path="/admin" element={<AdminDashboard />}>
                          <Route index element={<AdminHome />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="coupons" element={<AdminCoupons />} />
                          <Route path="users" element={<AdminUsers />} />
                        </Route>
                      </Route>
                      
                      {/* Not Found */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    
                    <Toaster />
                    <Sonner />
                  </ReviewProvider>
                </OrderProvider>
              </CartProvider>
            </CouponProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;