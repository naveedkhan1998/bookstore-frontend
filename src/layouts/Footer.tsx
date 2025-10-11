const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="text-sm text-gray-600 dark:text-gray-400">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span>&copy; {year} Bookstore Collective by</span>
        <a
          href="https://www.linkedin.com/in/ahmxdgamal"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-secondary hover:text-secondary-hover"
        >
          Ahmed (Jimmy) Abdalla
        </a>
        <span className="opacity-60"></span>
        <a
          href="https://www.linkedin.com/in/da-cheng-clay/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-secondary hover:text-secondary-hover"
        >
          Da Cheng (Clay)
        </a>
        <span className="opacity-60"></span>
        <a
          href="https://www.linkedin.com/in/mnk1998/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-secondary hover:text-secondary-hover"
        >
          Mohammad Naveed Khan
        </a>
      </div>
    </footer>
  );
};

export default Footer;
