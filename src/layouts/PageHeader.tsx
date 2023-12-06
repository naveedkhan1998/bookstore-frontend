import React, { useEffect, useState } from "react";
import file from "../assets/logo.png";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  MenuIcon,
  HomeIcon,
} from "lucide-react";
import Button from "../components/Button";
import { useSidebarContext } from "../context/SidebarContext";
import ProfileMenu from "../components/ProfileMenu";
import { useGetVolumesQuery } from "../services/googleBooksServices";
import { BookVolume } from "../comman-types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setBooks } from "../features/booksSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentToken } from "../features/authSlice";
import { UserType, setUserInfo } from "../features/userSlice";
import { useGetLoggedUserQuery } from "../services/userAuthService";
import { setUserBookslist } from "../features/booklistSlice";
import { useGetUserBooklistsQuery } from "../services/booklistsServices";

const PageHeader = () => {
  const access_token = useAppSelector(getCurrentToken);

  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("ALL");

  const [searchResults, setSearchResults] = useState([]);

  const { data, isSuccess, isLoading, refetch } = useGetVolumesQuery(
    searchTerm
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /// initial booklist set
  const {
    data: booklistData,
    isSuccess: booklistISuccess,
  } = useGetUserBooklistsQuery(access_token);

  if (booklistISuccess) {
    dispatch(setUserBookslist(booklistData));
  }

  function handleSearchClick(id: String) {
    setSearchTerm("");
    navigate(`/book/${id}`);
  }

  function handleSearch() {
    if (isSuccess) {
      setSearchTerm("");
      navigate("/");
      dispatch(setBooks(data.items));
    }
  }

  const handleOverlayClick = () => {
    setSearchTerm("");
  };

  const token = useAppSelector(getCurrentToken);
  const { data: userData } = useGetLoggedUserQuery(token);

  useEffect(() => {
    if (userData) {
      const newData: UserType = userData;
      dispatch(
        setUserInfo({
          ...newData,
          avatarUrl: `https://ui-avatars.com/api/?name=${newData.given_name}+${newData.family_name}`,
        })
      );
      console.log(newData);
    }
  }, [dispatch, userData, isSuccess]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        if (isLoading) {
          refetch();
        }

        if (searchTerm === "ALL") {
          setSearchResults([]);
          handleSearch();
          return;
        }

        const list_of_titles = data.items.slice(0, 12);
        setSearchResults(list_of_titles);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    // Debounce the API call to avoid making requests on every keystroke
    const debounceTimer = setTimeout(fetchSearchResults);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, data, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFullWidthSearch(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex gap-10 lg:gap-20 justify-between p-2  mx-4 mt-4 shadow-2xl rounded-full">
      <PageHeaderFirstSection hidden={showFullWidthSearch} />

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevents the default form submission behavior
          handleSearch();
        }}
        className={`gap-4 flex-grow justify-center ${
          showFullWidthSearch ? "flex" : "hidden md:flex"
        }`}
      >
        {showFullWidthSearch && (
          <Button
            onClick={() => setShowFullWidthSearch(false)}
            size="icon"
            variant="ghost"
            type="button"
            className="flex-shrink-0"
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="flex flex-grow max-w-[600px]">
          <input
            type="search"
            placeholder="Search Books"
            className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-2 px-4 text-lg w-full
            focus:border-blue-500 outline-none z-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              //navigate("/");
            }}
          />
          <Button
            className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 mr-3
            flex-shrink-0 z-50"
            type="submit"
          >
            <Search />
          </Button>
        </div>
      </form>

      {isSuccess && (
        <div
          className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80 flex justify-center items-center "
          onClick={handleOverlayClick}
        >
          <div className="flex justify-start items-center top-15 flex-col absolute h-[80%] w-[80%]  bg-zinc-400 rounded-3xl lg:px-40 px-8 pt-14 pb-72 overflow-auto z-50">
            <table className="w-full items-start justify-start  ">
              <thead>
                <tr>
                  <th className="py-2 px-4">Book Name</th>
                  <th className="py-2 px-4">Author</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((obj: BookVolume) => (
                  <tr
                    key={obj.id}
                    id={obj.id}
                    className="hover:bg-stone-400 rounded-2xl"
                    onClick={() => {
                      handleSearchClick(obj.id);
                    }}
                  >
                    <td className="py-2 px-4 rounded-2xl">
                      {obj.volumeInfo.title}
                    </td>
                    <td className="py-2 px-4 rounded-2xl">
                      {obj.volumeInfo?.authors?.join(" , ") || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div
        className={`flex items-center gap-3.5 xs:gap-6 md:gap-3.5 ${
          showFullWidthSearch ? "hidden" : "md:flex-shrink-0 xs:flex-shrink"
        }`}
      >
        <Button
          onClick={() => setShowFullWidthSearch(true)}
          size="icon"
          variant={searchTerm ? "default" : "ghost"}
          className="md:hidden z-50"
        >
          <Search />
        </Button>
        <Button
          size="icon"
          onClick={() => navigate("/")}
          variant="ghost"
          className="hidden sm:flex"
        >
          <HomeIcon />
        </Button>

        {!access_token && (
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className=" rounded-full"
          >
            Login
          </Button>
        )}
        {access_token && (
          <>
            <Button
              size="icon"
              onClick={() => navigate("/cart")}
              className="hidden xs:flex"
              variant="ghost"
              number={6}
            >
              <ShoppingCart />
            </Button>
            <Button size="icon" variant="ghost">
              <ProfileMenu />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

type PageHeaderFirstSectionProps = {
  hidden?: boolean;
};

export function PageHeaderFirstSection({
  hidden = false,
}: PageHeaderFirstSectionProps) {
  const { toggle } = useSidebarContext();
  return (
    <div
      className={`gap-4 items-center flex-shrink-0 ${
        hidden ? "hidden" : "flex"
      }`}
    >
      <Button onClick={toggle} variant="ghost" size="icon">
        <MenuIcon />
      </Button>

      <img src={file} className="h-6" alt="logo" />
    </div>
  );
}
