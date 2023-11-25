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
import OrderHistoryPage from "./OrderHistoryPage";
import UserSettings from "./UserSettingPage";
import UserProfile from "./UserProfilePage";
import BookPage from "./BookPage";

const MainPage = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex flex-col max-h-screen bg-stone-400">
          <PageHeader />
          <div
            className="grid grid-cols-[auto,1fr] flex-grow-1 
          overflow-auto"
          >
            <Sidebar />
            <div className="overflow-x-hidden px-4 pb-4">
              <div className="flex flex-col items-center px-4 pb-20 min-h-screen">
                <Routes>
                  <Route path="/" element={<BooksList />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/account" element={<UserProfile />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} />
                  <Route path="/test" element={<FetchTest />} />
                  <Route path="/book/:id" element={<BookPage />} />
                  <Route path="/item/:id" element={<ItemPage />} />
                  <Route path="/setting" element={<UserSettings />} />
                </Routes>
              </div>
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
