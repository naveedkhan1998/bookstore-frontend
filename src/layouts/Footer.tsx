import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-200 text-black p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>
          &copy; 2023
          <a
            href="https://www.linkedin.com/in/ahmed-abdalla/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500"
          >
            Ahmed (Jimmy) Abdalla
          </a>
          ,
          <a
            href="https://www.linkedin.com/in/da-cheng-clay/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500"
          >
            Da Cheng (Clay)
          </a>
          ,
          <a
            href="https://www.linkedin.com/in/naveed-khan-956b10198/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500"
          >
            Mohammad Naveed Khan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
