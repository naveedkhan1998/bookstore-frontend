"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  MenuIcon,
  HomeIcon,
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

const SearchForm = memo<{
  showFullWidthSearch: boolean;
  searchTerm: string;
  setShowFullWidthSearch: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}>(
  ({
    showFullWidthSearch,
    searchTerm,
    setShowFullWidthSearch,
    setSearchTerm,
    handleSearch,
  }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
    };

    return (
      <form
        onSubmit={handleSubmit}
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
        <div className="flex flex-grow max-w-[600px]">
          <input
            type="search"
            placeholder="Search Books"
            className="z-50 w-full px-4 py-2 transition-all duration-300 ease-in-out rounded-l-full placeholder-main-text dark:placeholder-dark-text bg-main-primary dark:bg-dark-primary text-md focus:ring-2 focus:ring-accent-DEFAULT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="z-50 flex-shrink-0 px-4 py-2 mr-3 transition-all duration-300 ease-in-out rounded-r-full hover:bg-accent-hover"
            type="submit"
          >
            <Search />
          </Button>
        </div>
      </form>
    );
  },
);

const SearchResultsOverlay = memo<{
  searchResults: BookVolume[];
  handleSearchClick: (id: string) => void;
  handleOverlayClick: () => void;
}>(({ searchResults, handleSearchClick, handleOverlayClick }) => (
  <div
    className="fixed inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-70"
    onClick={handleOverlayClick}
  >
    <div
      className="relative flex flex-col w-full max-w-3xl overflow-hidden transition-all duration-300 ease-in-out transform rounded-lg shadow-lg h-3/4 bg-main-secondary dark:bg-dark-secondary hover:scale-105"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between px-6 py-4 bg-main-primary dark:bg-dark-primary">
        <h2 className="text-lg font-semibold">Search Results</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleOverlayClick}
          className="transition-transform duration-300 ease-in-out hover:rotate-180"
        >
          <ArrowLeft />
        </Button>
      </header>
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-main-primary/60 dark:bg-dark-primary/60">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Book Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                Author
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-main-secondary dark:bg-dark-secondary dark:divide-gray-700">
            {searchResults.map((book) => (
              <tr
                key={book.id}
                className="transition-colors duration-300 ease-in-out cursor-pointer hover:bg-main-primary/60 hover:dark:bg-dark-primary/60"
                onClick={() => handleSearchClick(book.id)}
              >
                <td className="px-6 py-4 text-sm">
                  {book.volumeInfo.title.length > 30
                    ? `${book.volumeInfo.title.substring(0, 30)}...`
                    : book.volumeInfo.title}
                </td>
                <td className="px-6 py-4 text-sm">
                  {book.volumeInfo?.authors?.join(", ") || "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
));

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
      <SearchForm
        showFullWidthSearch={showFullWidthSearch}
        searchTerm={searchTerm}
        setShowFullWidthSearch={setShowFullWidthSearch}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      {isSuccess && (
        <SearchResultsOverlay
          searchResults={searchResults}
          handleSearchClick={handleSearchClick}
          handleOverlayClick={() => setSearchTerm("")}
        />
      )}
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
