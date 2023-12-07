import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-8 mt-10 shadow-2xl rounded-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        About This Website
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frontend Technologies:</h2>
        <ul className="list-disc ml-6">
          <li>
            <strong>React:</strong> A powerful JavaScript library for building
            interactive user interfaces. Its component-based architecture allows
            for modular and reusable code.
          </li>
          <li>
            <strong>TypeScript:</strong> A superset of JavaScript that adds
            static typing, enhancing code quality and developer productivity.
          </li>
          <li>
            <strong>Tailwind CSS:</strong> A utility-first CSS framework that
            enables rapid UI development with a highly customizable and
            low-level utility approach.
          </li>
          <li>
            <strong>Redux Toolkit:</strong> A set of tools and conventions for
            managing state in React applications, making it easier to develop
            complex UIs.
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Backend Technologies:</h2>
        <ul className="list-disc ml-6">
          <li>
            <strong>Express:</strong> A fast and minimalistic web framework for
            Node.js, providing a robust foundation for building RESTful APIs and
            handling server-side logic.
          </li>
          <li>
            <strong>MongoDB:</strong> A NoSQL database offering scalability and
            flexibility. It's used to store user information, book data, and
            other relevant details.
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Key Features:</h2>
        <ul className="list-disc ml-6">
          <li>
            <strong>Google Books API Integration:</strong> Seamless integration
            with the Google Books API to fetch detailed information about a vast
            collection of books.
          </li>
          <li>
            <strong>User Authentication:</strong> Secure user authentication
            allows users to create accounts, log in, and personalize their
            booklists.
          </li>
          <li>
            <strong>Booklist Sharing:</strong> Share your curated booklist with
            others, fostering a community of book enthusiasts.
          </li>
          <li>
            <strong>Shopping Cart:</strong> Users can add books to their cart
            for a convenient shopping experience.
          </li>
          <li>
            <strong>Checkout:</strong> A streamlined checkout process allows
            users to purchase books from their cart with ease.
          </li>
        </ul>
      </div>

      <p className="text-lg">
        The combination of these frontend and backend technologies creates a
        modern, efficient, and user-friendly web application. The website is
        designed to provide a seamless experience for exploring, curating, and
        purchasing books. Your feedback is valuable to us as we continue to
        improve and expand our features. Enjoy your journey into the world of
        books!
      </p>
    </div>
  );
};

export default AboutPage;
