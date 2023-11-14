// App.js
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./layouts/Footer";
import FetchTest from "./components/FetchTest";
import SidebarProvider from "./context/SidebarContext";
import PageHeader from "./layouts/PageHeader";
import Sidebar from "./components/Components";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="max-h-screen flex flex-col bg-stone-400 flex-shrink-0">
          <PageHeader />
          <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
            <Sidebar />
            <div className="overflow-x-hidden px-8  pb-4 h-full">
              <Routes>
                <Route path="/" element={<FetchTest />} />
                <Route path="/cart" element={<FetchTest />} />
                <Route path="/account" element={<FetchTest />} />
                <Route path="/order-history" element={<FetchTest />} />
              </Routes>
            </div>
          </div>
          <div className=" bg-slate-800">
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
