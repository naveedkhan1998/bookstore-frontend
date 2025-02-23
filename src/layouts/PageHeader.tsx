import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  MenuIcon,
  HomeIcon,
  X,
  BookOpen,
  User2,
} from "lucide-react";
import { DarkThemeToggle } from "flowbite-react";
import Button from "../components/ui/button/Button";
import ProfileMenu from "../components/ProfileMenu";
import logoImage from "../assets/logo.png";
import { useSidebarContext } from "../context/SidebarContext";
import { useGetVolumesQuery } from "../services/googleBooksServices";
import { useGetCartQuery } from "../services/cartServices";
import { useGetUserBooklistsQuery } from "../services/booklistsServices";
import { useGetLoggedUserQuery } from "../services/userAuthService";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getUserCart, setUserCart } from "../features/cartSlice";
import { setBooks } from "../features/booksSlice";
import { UserType, setUserInfo } from "../features/userSlice";
import { setUserBookslist } from "../features/booklistSlice";
import type { BookVolume } from "../comman-types";

// New SearchDropdown Component
const SearchDropdown = memo<{
  searchResults: BookVolume[];
  handleSearchClick: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}>(
  ({
    searchResults,
    handleSearchClick,
    searchTerm,
    setSearchTerm,
    handleSearch,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsOpen(searchTerm.length > 0 && searchResults.length > 0);
    }, [searchTerm, searchResults]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
    };

    return (
      <div className="relative flex-grow max-w-3xl" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for books, authors, or genres..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm transition-all duration-200 [&::-webkit-search-cancel-button]:hidden
                     [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden
                     [&::-webkit-search-results-decoration]:hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </form>

        {isOpen && (
          <div
            className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                      border border-gray-200 dark:border-gray-700 overflow-hidden z-50
                      transition-all duration-200 ease-in-out transform"
          >
            <div className="max-h-[70vh] overflow-y-auto">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSearchClick(book.id)}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700
                         cursor-pointer transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    {book.volumeInfo.imageLinks ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="w-16 h-20 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {book.volumeInfo.title}
                    </h3>
                    <div className="flex items-center mt-1 gap-2">
                      <User2 className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {book.volumeInfo.authors?.join(", ") ||
                          "Unknown Author"}
                      </p>
                    </div>
                    {book.volumeInfo.categories && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {book.volumeInfo.categories[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {searchResults.length > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSearch}
                  className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700
                         dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  View all results
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

// Memoized Header Section Components
export const PageHeaderFirstSection = memo<{ hidden?: boolean }>(
  ({ hidden }) => {
    const { toggle } = useSidebarContext();

    return (
      <div
        className={`gap-4 items-center flex-shrink-0 ${hidden ? "hidden" : "flex"}`}
      >
        <Button
          onClick={toggle}
          variant="ghost"
          size="icon"
          className="transition-transform duration-300 ease-in-out hover:rotate-180"
        >
          <MenuIcon />
        </Button>
        <img
          src={logoImage}
          className="h-8 transition-transform duration-300 ease-in-out hover:scale-110"
          alt="BookStore Logo"
        />
      </div>
    );
  },
);

const HeaderButtons = memo<{
  showFullWidthSearch: boolean;
  searchTerm: string;
  setShowFullWidthSearch: (show: boolean) => void;
  accessToken: string | null | undefined;
  cartData: ReturnType<typeof getUserCart>;
}>(
  ({
    showFullWidthSearch,
    searchTerm,
    setShowFullWidthSearch,
    accessToken,
    cartData,
  }) => {
    const navigate = useNavigate();
    const cartItemCount = Object.values(
      cartData.books as Record<string, number>,
    ).reduce((acc, val) => acc + val, 0);

    return (
      <div
        className={`flex items-center gap-3.5 xs:gap-6 md:gap-3.5 ${
          showFullWidthSearch ? "hidden" : "md:flex-shrink-0 xs:flex-shrink"
        }`}
      >
        <Button
          onClick={() => setShowFullWidthSearch(true)}
          size="icon"
          variant={searchTerm ? "default" : "ghost"}
          className="z-50 transition-transform duration-300 ease-in-out md:hidden hover:scale-110"
        >
          <Search />
        </Button>
        <Button
          size="icon"
          onClick={() => navigate("/")}
          variant="ghost"
          className="hidden transition-transform duration-300 ease-in-out sm:flex hover:scale-110"
        >
          <HomeIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="z-50 transition-transform duration-300 ease-in-out hover:scale-110"
        >
          <DarkThemeToggle className="rounded-full hover:bg-light-mode-hover dark:hover:bg-dark-mode-hover" />
        </Button>

        {!accessToken ? (
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className="transition-all duration-300 ease-in-out rounded-full hover:bg-accent-DEFAULT hover:text-white"
          >
            Login
          </Button>
        ) : (
          <>
            <Button
              size="icon"
              onClick={() => navigate("/cart")}
              className="hidden transition-transform duration-300 ease-in-out xs:flex hover:scale-110"
              variant="ghost"
              number={cartItemCount}
            >
              <ShoppingCart />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="transition-transform duration-300 ease-in-out hover:scale-110"
            >
              <ProfileMenu />
            </Button>
          </>
        )}
      </div>
    );
  },
);

const PageHeader: React.FC = () => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("Time");
  const [searchResults, setSearchResults] = useState<BookVolume[]>([]);

  const accessToken = useAppSelector(getCurrentToken);
  const cartDataSelector = useAppSelector(getUserCart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: cartData, isSuccess: cartSuccess } =
    useGetCartQuery(accessToken);
  const { data: booklistData, isSuccess: booklistSuccess } =
    useGetUserBooklistsQuery(accessToken);
  const { data: userData } = useGetLoggedUserQuery(accessToken);
  const { data, isSuccess, isLoading, refetch } =
    useGetVolumesQuery(searchTerm);

  const handleSearchClick = useCallback(
    (id: string) => {
      setSearchTerm("");
      navigate(`/book/${id}`);
    },
    [navigate],
  );

  const handleSearch = useCallback(() => {
    if (isSuccess) {
      setSearchTerm("");
      navigate("/");
      dispatch(setBooks(data.items));
    }
  }, [isSuccess, navigate, dispatch, data]);

  // Handle data updates
  useEffect(() => {
    if (cartSuccess) dispatch(setUserCart(cartData));
    if (booklistSuccess) dispatch(setUserBookslist(booklistData));
    if (userData) {
      const newData: UserType = userData;
      dispatch(
        setUserInfo({
          ...newData,
          avatarUrl: `https://ui-avatars.com/api/?name=${newData.given_name}+${newData.family_name}`,
        }),
      );
    }
  }, [
    cartSuccess,
    cartData,
    booklistSuccess,
    booklistData,
    userData,
    dispatch,
  ]);

  // Handle search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        if (isLoading) await refetch();
        if (searchTerm === "Time") {
          setSearchResults([]);
          handleSearch();
          return;
        }
        setSearchResults(data?.items?.slice(0, 12) || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, data, isLoading, refetch, handleSearch]);

  // Handle responsive search
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setShowFullWidthSearch(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex justify-between gap-10 p-2 transition-all duration-300 ease-in-out shadow-md lg:gap-20 bg-main-secondary dark:bg-dark-secondary">
      <PageHeaderFirstSection hidden={showFullWidthSearch} />
      <div
        className={`flex-grow justify-center ${showFullWidthSearch ? "flex" : "hidden md:flex"}`}
      >
        {showFullWidthSearch && (
          <Button
            onClick={() => setShowFullWidthSearch(false)}
            size="icon"
            variant="ghost"
            type="button"
            className="flex-shrink-0 transition-transform duration-300 ease-in-out hover:-translate-x-1"
          >
            <ArrowLeft />
          </Button>
        )}
        <SearchDropdown
          searchResults={searchResults}
          handleSearchClick={handleSearchClick}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>
      <HeaderButtons
        showFullWidthSearch={showFullWidthSearch}
        searchTerm={searchTerm}
        setShowFullWidthSearch={setShowFullWidthSearch}
        accessToken={accessToken}
        cartData={cartDataSelector}
      />
    </nav>
  );
};

export default PageHeader;
