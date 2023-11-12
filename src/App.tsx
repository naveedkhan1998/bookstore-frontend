// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import FetchTest from "./components/FetchTest";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <Routes>
              <Route path="/">Home</Route>
              <Route path="/about">About</Route>
            </Routes>
            <FetchTest />
            <h1 className="text-small paddings">Hello</h1>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
