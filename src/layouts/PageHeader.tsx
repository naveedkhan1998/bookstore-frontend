import React, { useEffect, useState, useCallback } from "react";
import file from "../assets/logo.png";
import { ArrowLeft, Search, ShoppingCart, MenuIcon, HomeIcon } from "lucide-react";
import Button from "../components/Button";
import { useSidebarContext } from "../context/SidebarContext";
import ProfileMenu from "../components/ProfileMenu";
import { useGetVolumesQuery } from "../services/googleBooksServices";
import { BookVolume } from "../comman-types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setBooks } from "../features/booksSlice";
import { useNavigate } from "react-router-dom";
import { getCurrentToken } from "../features/authSlice";
import { UserType, setUserInfo } from "../features/userSlice";
import { useGetLoggedUserQuery } from "../services/userAuthService";
import { setUserBookslist } from "../features/booklistSlice";
import { useGetUserBooklistsQuery } from "../services/booklistsServices";
import { useGetCartQuery } from "../services/cartServices";
import { getUserCart, setUserCart } from "../features/cartSlice";
import Spinner from "../components/Spinner";
import { DarkThemeToggle } from "flowbite-react";

const PageHeader: React.FC = () => {
  const accessToken = useAppSelector(getCurrentToken);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showFullWidthSearch, setShowFullWidthSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("Time");
  const [searchResults, setSearchResults] = useState<BookVolume[]>([]);

  const { data: cartData, isSuccess: cartSuccess } = useGetCartQuery(accessToken);
  const { data, isSuccess, isLoading, refetch } = useGetVolumesQuery(searchTerm);
  const { data: booklistData, isSuccess: booklistSuccess } = useGetUserBooklistsQuery(accessToken);
  const { data: userData } = useGetLoggedUserQuery(accessToken);

  const cartDataSelector = useAppSelector(getUserCart);

  useEffect(() => {
    if (cartSuccess) {
      dispatch(setUserCart(cartData));
    }
  }, [cartSuccess, cartData, dispatch]);

  useEffect(() => {
    if (booklistSuccess) {
      dispatch(setUserBookslist(booklistData));
    }
  }, [booklistSuccess, booklistData, dispatch]);

  useEffect(() => {
    if (userData) {
      const newData: UserType = userData;
      dispatch(
        setUserInfo({
          ...newData,
          avatarUrl: `https://ui-avatars.com/api/?name=${newData.given_name}+${newData.family_name}`,
        })
      );
    }
  }, [userData, dispatch]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        if (isLoading) {
          await refetch();
        }

        if (searchTerm === "Time") {
          setSearchResults([]);
          handleSearch();
          return;
        }

        setSearchResults(data?.items.slice(0, 12) || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, data, isLoading, refetch]);

  const handleSearchClick = (id: string) => {
    setSearchTerm("");
    navigate(`/book/${id}`);
  };

  const handleSearch = () => {
    if (isSuccess) {
      setSearchTerm("");
      navigate("/");
      dispatch(setBooks(data.items));
    }
  };

  const handleOverlayClick = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFullWidthSearch(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-between gap-10 p-2 border-b lg:gap-20">
      <PageHeaderFirstSection hidden={showFullWidthSearch} />
      <SearchForm showFullWidthSearch={showFullWidthSearch} searchTerm={searchTerm} setShowFullWidthSearch={setShowFullWidthSearch} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      {isSuccess && <SearchResultsOverlay searchResults={searchResults} handleSearchClick={handleSearchClick} handleOverlayClick={handleOverlayClick} />}
      <HeaderButtons showFullWidthSearch={showFullWidthSearch} searchTerm={searchTerm} setShowFullWidthSearch={setShowFullWidthSearch} accessToken={accessToken} cartData={cartDataSelector} />
    </div>
  );
};

type PageHeaderFirstSectionProps = {
  hidden?: boolean;
};

export const PageHeaderFirstSection: React.FC<PageHeaderFirstSectionProps> = ({ hidden }) => {
  const { toggle } = useSidebarContext();
  return (
    <div className={`gap-4 items-center flex-shrink-0 ${hidden ? "hidden" : "flex"}`}>
      <Button onClick={toggle} variant="ghost" size="icon">
        <MenuIcon />
      </Button>
      <img src={file} className="h-6" alt="logo" />
    </div>
  );
};

type SearchFormProps = {
  showFullWidthSearch: boolean;
  searchTerm: string;
  setShowFullWidthSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ showFullWidthSearch, searchTerm, setShowFullWidthSearch, setSearchTerm, handleSearch }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSearch();
    }}
    className={`flex-grow justify-center ${showFullWidthSearch ? "flex" : "hidden md:flex"}`}
    aria-label="Search Form"
  >
    {showFullWidthSearch && (
      <Button onClick={() => setShowFullWidthSearch(false)} size="icon" variant="ghost" type="button" className="flex-shrink-0" aria-label="Back to Search">
        <ArrowLeft />
      </Button>
    )}
    <div className="flex flex-grow max-w-[600px]">
      <input
        type="search"
        placeholder="Search Books"
        className="z-50 w-full px-4 py-2 placeholder-black rounded-l-full bg-main-secondary dark:bg-dark-secondary text-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search Input"
      />
      <Button className="z-50 flex-shrink-0 px-4 py-2 mr-3 rounded-r-full bg-main-secondary dark:bg-dark-secondary hover:bg-main-secondary" type="submit" aria-label="Submit Search">
        <Search />
      </Button>
    </div>
  </form>
);

type SearchResultsOverlayProps = {
  searchResults: BookVolume[];
  handleSearchClick: (id: string) => void;
  handleOverlayClick: () => void;
};

const SearchResultsOverlay: React.FC<SearchResultsOverlayProps> = ({ searchResults, handleSearchClick, handleOverlayClick }) => (
  <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70" onClick={handleOverlayClick}>
    <div className="relative flex flex-col w-full max-w-3xl overflow-hidden rounded-lg shadow-lg h-3/4 bg-main-secondary dark:bg-dark-secondary " onClick={(e) => e.stopPropagation()}>
      <header className="flex items-center justify-between px-6 py-4 bg-main-primary dark:bg-dark-primary">
        <h2 className="text-lg font-semibold ">Search Results</h2>
        <Button size="icon" variant="ghost" onClick={handleOverlayClick} aria-label="Close">
          <ArrowLeft />
        </Button>
      </header>
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-main-primary/60 dark:bg-dark-primary/60">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ">Book Name</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ">Author</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-main-secondary dark:bg-dark-secondary dark:divide-gray-700">
            {searchResults.map((obj) => (
              <tr key={obj.id} id={obj.id} className="cursor-pointer hover:bg-main-primary/60 hover:dark:bg-dark-primary/60" onClick={() => handleSearchClick(obj.id)}>
                <td className="px-6 py-4 text-sm ">{obj.volumeInfo.title.length > 30 ? `${obj.volumeInfo.title.substring(0, 30)}...` : obj.volumeInfo.title}</td>
                <td className="px-6 py-4 text-sm ">{obj.volumeInfo?.authors?.join(", ") || "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

type HeaderButtonsProps = {
  showFullWidthSearch: boolean;
  searchTerm: string;
  setShowFullWidthSearch: React.Dispatch<React.SetStateAction<boolean>>;
  accessToken: string | null | undefined;
  cartData: ReturnType<typeof getUserCart>;
};

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ showFullWidthSearch, searchTerm, setShowFullWidthSearch, accessToken, cartData }) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-3.5 xs:gap-6 md:gap-3.5 ${showFullWidthSearch ? "hidden" : "md:flex-shrink-0 xs:flex-shrink"}`}>
      <Button onClick={() => setShowFullWidthSearch(true)} size="icon" variant={searchTerm ? "default" : "ghost"} className="z-50 md:hidden">
        <Search />
      </Button>
      <Button size="icon" onClick={() => navigate("/")} variant="ghost" className="hidden sm:flex">
        <HomeIcon />
      </Button>
      <Button size="icon" variant="ghost" className="z-50">
        <DarkThemeToggle className="rounded-full hover:bg-light-mode-hover dark:hover:bg-dark-mode-hover" />
      </Button>
      {!accessToken && (
        <Button onClick={() => navigate("/login")} variant="ghost" className="rounded-full ">
          Login
        </Button>
      )}
      {accessToken && (
        <>
          <Button size="icon" onClick={() => navigate("/cart")} className="hidden xs:flex" variant="ghost" number={Object.values(cartData.books).reduce((acc, val) => acc + val, 0)}>
            <ShoppingCart />
          </Button>
          <Button size="icon" variant="ghost">
            <ProfileMenu />
          </Button>
        </>
      )}
    </div>
  );
};

export default PageHeader;
