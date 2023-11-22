import React, { useEffect, useState } from "react";
import file from "../assets/logo.png";
import { ArrowLeft, Search, ShoppingCart, MenuIcon } from "lucide-react";
import Button from "../components/Button";
import { useSidebarContext } from "../context/SidebarContext";
import ProfileMenu from "../components/ProfileMenu";
import { useGetVolumesQuery } from "../services/googleBooksServices";
import { BookVolume } from "../comman-types";
import DefaultThumbnail from "../assets/pp.jpg";
import { useAppDispatch } from "../app/hooks";
import { setBooks } from "../features/booksSlice";
import { useNavigate } from "react-router-dom";

const PageHeader = () => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("ALL");

  const [searchResults, setSearchResults] = useState([]);

  const { data, isSuccess, isLoading, refetch } = useGetVolumesQuery(
    searchTerm
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  }, [searchTerm, data]);

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
    <div className="flex gap-10 lg:gap-20 justify-between p-2 mb-6 mx-4 mt-4 shadow-2xl rounded-full">
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
        <div className="modal z-10">
          <div
            className="fixed inset-0 z-40"
            onClick={handleOverlayClick}
          ></div>
          <div className="modal_wrapper z-50">
            <table className="w-full items-start justify-start shadow-2xl rounded-b-2xl ">
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
                  >
                    <td className="py-2 px-4 rounded-2xl">
                      {obj.volumeInfo.title}
                    </td>
                    <td className="py-2 px-4 rounded-2xl">
                      {obj.volumeInfo?.authors || "None"}
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
        <Button size="icon" variant="ghost" number={6}>
          <ShoppingCart />
        </Button>
        <Button size="icon" variant="ghost">
          <ProfileMenu />
        </Button>
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
      <a href="/">
        <img src={file} className="h-6" alt="logo" />
      </a>
    </div>
  );
}
