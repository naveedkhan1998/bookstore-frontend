import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import SidebarProvider from "../context/SidebarContext";
import PageHeader from "../layouts/PageHeader";
import Sidebar from "../components/Sidebar";
import FetchTest from "../components/FetchTest";
import Footer from "../layouts/Footer";
import ItemPage from "./ItemPage";

const MainPage = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="max-h-screen flex flex-col bg-stone-400 flex-shrink-0 min-h-screen">
          <PageHeader />
          <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto ">
            <Sidebar />
            <div className="overflow-x-hidden px-8  pb-4 h-full ">
              <Routes>
                <Route path="/" element={<FetchTest />} />
                <Route path="/cart" element={<FetchTest />} />
                <Route path="/account" element={<FetchTest />} />
                <Route path="/order-history" element={<FetchTest />} />
                <Route path="/item/:id" element={<ItemPage/>} />
              </Routes>
            </div>
          </div>
          <div className=" bg-slate-800 bg-opacity-90 fixed bottom-0 w-full">
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default MainPage;
