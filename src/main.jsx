import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter/variable.css";
// import "@fontsource/inter";
import "./main.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import Layout from "./layout/Layout";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import BrowseProductsPage from "./pages/BrowseProductsPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import HomePage from "./pages/HomePage";

const theme = extendTheme({
  fonts: {
    heading: `'InterVariable', sans-serif`,
    body: `'InterVariable', sans-serif`,
  },
  color: {
    bluey: "164aff",
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/cart" element={<CartPage />} exact />
            <Route path="/orders" element={<OrderPage />} exact />
            <Route path="/products" element={<BrowseProductsPage />} exact />
            <Route path="/product/:id" element={<ProductPage />} exact />
            <Route path="/login" element={<LoginPage />} exact />
            <Route path="/register" element={<RegisterPage />} exact />
            <Route path="/payment" element={<PaymentPage />} exact />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
