import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  MenuIcon,
  HomeIcon,
  X,
  BookOpen,
  User2,
  Bell,
  Sparkles,
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

// Search Dropdown Component with modern design
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
      <div className="relative flex-grow max-w-2xl" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex items-center w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 transition-colors group-focus-within:text-brand-primary" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="w-full h-11 pl-12 pr-12 bg-white dark:bg-dark-tertiary border border-gray-200 dark:border-gray-700
                       rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                       transition-all duration-200 [&::-webkit-search-cancel-button]:hidden
                       shadow-sm hover:shadow-md"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                         text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                         transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {isOpen && (
          <div
            className="absolute w-full mt-3 bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl
                      border border-gray-200 dark:border-gray-700 overflow-hidden z-50
                      animate-slideDown"
          >
            <div className="max-h-[70vh] overflow-y-auto scrollbar-hidden">
              {searchResults.map((book, index) => (
                <div
                  key={book.id}
                  onClick={() => handleSearchClick(book.id)}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-tertiary/50
                         cursor-pointer transition-all duration-200 group border-b border-gray-100 
                         dark:border-gray-800 last:border-0"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex-shrink-0 relative">
                    {book.volumeInfo.imageLinks ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="w-14 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg 
                                 transition-shadow duration-200"
                      />
                    ) : (
                      <div
                        className="w-14 h-20 bg-gradient-to-br from-gray-100 to-gray-200 
                                    dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center 
                                    justify-center shadow-md"
                      >
                        <BookOpen className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3
                      className="text-sm font-semibold text-gray-900 dark:text-white truncate 
                                 group-hover:text-brand-primary dark:group-hover:text-brand-primary-light
                                 transition-colors duration-200"
                    >
                      {book.volumeInfo.title}
                    </h3>
                    <div className="flex items-center mt-1.5 gap-1.5">
                      <User2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {book.volumeInfo.authors?.join(", ") ||
                          "Unknown Author"}
                      </p>
                    </div>
                    {book.volumeInfo.categories && (
                      <div className="mt-2">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                                       font-medium bg-brand-primary/10 text-brand-primary 
                                       dark:bg-brand-primary/20 dark:text-brand-primary-light"
                        >
                          {book.volumeInfo.categories[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {searchResults.length > 0 && (
              <div
                className="sticky bottom-0 p-3 bg-gray-50 dark:bg-dark-tertiary/80 backdrop-blur-sm
                            border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={handleSearch}
                  className="w-full py-2.5 px-4 text-sm font-medium text-brand-primary hover:text-brand-primary-hover
                         dark:text-brand-primary-light dark:hover:text-white
                         bg-brand-primary/5 hover:bg-brand-primary/10 dark:bg-brand-primary/10 
                         dark:hover:bg-brand-primary/20 rounded-lg transition-all duration-200
                         flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  View all {searchResults.length} results
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
SearchDropdown.displayName = "SearchDropdown";

// Logo and Menu Section
export const PageHeaderFirstSection = memo<{ hidden?: boolean }>(
  ({ hidden }) => {
    const { toggle } = useSidebarContext();

    return (
      <div
        className={`gap-3 items-center flex-shrink-0 ${hidden ? "hidden" : "flex"}`}
      >
        <Button
          onClick={toggle}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl transition-all duration-200
                   hover:rotate-90 transform"
        >
          <MenuIcon className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <img
            src={logoImage}
            className="h-8 w-auto transition-transform duration-300 hover:scale-105"
            alt="BookStore"
          />
          <span className="hidden sm:block text-lg font-bold text-gradient">
            BookStore
          </span>
        </div>
      </div>
    );
  },
);
PageHeaderFirstSection.displayName = "PageHeaderFirstSection";

// Header Action Buttons
const HeaderButtons = memo<{
  showFullWidthSearch: boolean;
  setShowFullWidthSearch: (show: boolean) => void;
  accessToken: string | null | undefined;
  cartData: ReturnType<typeof getUserCart>;
}>(({ showFullWidthSearch, setShowFullWidthSearch, accessToken, cartData }) => {
  const navigate = useNavigate();
  const cartItemCount = Object.values(
    cartData.books as Record<string, number>,
  ).reduce((acc, val) => acc + val, 0);

  return (
    <div
      className={`flex items-center gap-2 ${
        showFullWidthSearch ? "hidden" : "flex"
      }`}
    >
      {/* Mobile Search Button */}
      <Button
        onClick={() => setShowFullWidthSearch(true)}
        size="icon"
        variant="ghost"
        className="md:hidden hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl"
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Home Button */}
      <Button
        size="icon"
        onClick={() => navigate("/")}
        variant="ghost"
        className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl"
      >
        <HomeIcon className="w-5 h-5" />
      </Button>

      {/* Notifications (placeholder) */}
      {accessToken && (
        <Button
          size="icon"
          variant="ghost"
          className="relative hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl hidden lg:flex"
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full 
                           ring-2 ring-white dark:ring-dark-secondary"
          ></span>
        </Button>
      )}

      {/* Dark Mode Toggle */}
      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl"
      >
        <DarkThemeToggle className="rounded-full" />
      </Button>

      {!accessToken ? (
        <Button
          onClick={() => navigate("/auth")}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl
                     px-4 py-2 text-sm font-medium transition-all duration-200 
                     shadow-sm hover:shadow-md"
        >
          Sign In
        </Button>
      ) : (
        <>
          {/* Cart Button */}
          <Button
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl"
            variant="ghost"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center 
                               justify-center bg-brand-accent text-white text-xs font-bold 
                               rounded-full px-1.5 shadow-md ring-2 ring-white dark:ring-dark-secondary"
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Button>

          {/* Profile Menu */}
          <div className="hover:opacity-90 transition-opacity">
            <ProfileMenu />
          </div>
        </>
      )}
    </div>
  );
});
HeaderButtons.displayName = "HeaderButtons";

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
    <header
      className="flex-shrink-0 w-full border-b border-gray-200 dark:border-gray-800
                 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-xl header-blur
                 shadow-sm transition-all duration-300 z-40"
    >
      <nav className="flex items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-3 max-w-[1920px] mx-auto">
        <PageHeaderFirstSection hidden={showFullWidthSearch} />

        <div
          className={`flex-grow flex items-center justify-center ${
            showFullWidthSearch ? "flex" : "hidden md:flex"
          }`}
        >
          {showFullWidthSearch && (
            <Button
              onClick={() => setShowFullWidthSearch(false)}
              size="icon"
              variant="ghost"
              type="button"
              className="mr-2 hover:bg-gray-100 dark:hover:bg-dark-tertiary rounded-xl"
            >
              <X className="w-5 h-5" />
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
          setShowFullWidthSearch={setShowFullWidthSearch}
          accessToken={accessToken}
          cartData={cartDataSelector}
        />
      </nav>
    </header>
  );
};

export default PageHeader;
