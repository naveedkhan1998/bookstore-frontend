import React from "react";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import FetchTest from "./components/FetchTest";

function App() {
  return (
    <>
      <div className="flexCenter  flex flex-col">
        <Navbar />
        <FetchTest />
        <h1 className="text-small paddings">Hello</h1>
        <Footer />
      </div>
    </>
  );
}

export default App;
