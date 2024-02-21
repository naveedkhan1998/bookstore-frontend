import React from "react";

const Footer = () => {
  return (
    <footer className="   bg-opacity-50 bg-transparent">
      <div className="container mx-auto text-center">
        <p>
          &copy; 2023
          <a
            href="https://www.linkedin.com/in/ahmxdgamal"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 "
          >
            Ahmed (Jimmy) Abdalla
          </a>
          ,
          <a
            href="https://www.linkedin.com/in/da-cheng-clay/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 "
          >
            Da Cheng (Clay)
          </a>
          ,
          <a
            href="https://www.linkedin.com/in/mohammad-naveed-khan-956b10198/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 "
          >
            Mohammad Naveed Khan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
