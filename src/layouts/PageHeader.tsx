import React, { useEffect, useState } from "react";
import file from "../assets/logo.png";
import { ArrowLeft, Search, ShoppingCart, MenuIcon } from "lucide-react";
import Button from "../components/Button";
import { useSidebarContext } from "../context/SidebarContext";
import ProfileMenu from "../components/ProfileMenu";

const PageHeader = () => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);

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
    <div className="flex gap-10 lg:gap-20 justify-between p-2 mb-6 mx-4 mt-4">
      {/* <PageHeaderFirstSection hidden={showFullWidthSearch} /> */}
      <PageHeaderFirstSection />
      <form
        className={` gap-4 flex-grow justify-center ${
          showFullWidthSearch ? "flex" : "hidden md:flex"
        }`}
      >
        {showFullWidthSearch && (
          <Button
            onClick={() => setShowFullWidthSearch(false)}
            size={"icon"}
            variant={"ghost"}
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
            className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-lg w-full
            focus:border-blue-500 outline-none"
          />
          <Button
            className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0
          flex-shrink-0"
          >
            <Search />
          </Button>
        </div>
      </form>
      <div
        className={`flex-shrink-0 md:gap-3.5 xs:gap-4 ${
          showFullWidthSearch ? "hidden" : "flex"
        }`}
      >
        <Button
          onClick={() => setShowFullWidthSearch(true)}
          size="icon"
          variant="ghost"
          className="md:hidden"
        >
          <Search />
        </Button>
        <Button size={"icon"} variant={"ghost"} number={6}>
          <ShoppingCart />
        </Button>
        <Button size={"icon"} variant={"ghost"} >
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
      <Button onClick={toggle} variant={"default"} size={"icon"}>
        <MenuIcon />
      </Button>
      <a href="/">
        <img src={file} className="h-12 " alt="logo" />
      </a>
    </div>
  );
}
