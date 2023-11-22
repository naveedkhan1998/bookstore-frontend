import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import SidebarProvider from "../context/SidebarContext";
import PageHeader from "../layouts/PageHeader";
import Sidebar from "../components/Sidebar";
import FetchTest from "../components/FetchTest";
import Footer from "../layouts/Footer";
import ItemPage from "./ItemPage";
import BooksList from "../components/BooksList";
import CartPage from "./CartPage";
import AccountPage from "./AccountPage";
import OrderHistoryPage from "./OrderHistoryPage";

const MainPage = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-stone-400">
          <PageHeader />
          <div className="grid md:grid-cols-[auto,1fr] flex-grow-1 overflow-auto w-full">
            <Sidebar />
            <div className="flex flex-col items-center justify-center px-8 pb-20 h-full">
              <Routes>
                <Route path="/" element={<BooksList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/test" element={<FetchTest />} />
                <Route path="/item/:id" element={<ItemPage />} />
              </Routes>
            </div>

            <div className="fixed bottom-0 w-full">
              <div className="bg-slate-800 bg-opacity-90 transition-all duration-300 ease-in-out">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default MainPage;
