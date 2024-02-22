import React, { Children, ElementType, ReactNode, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Home,
  ShoppingCart,
  UserCircle2 as UserCircle2Icon,
  History as HistoryIcon,
  BookTextIcon,
  InfoIcon,
  BookOpen,
  ShieldCheckIcon,
} from "lucide-react";
import Button, { buttonStyles } from "./Button";
import { twMerge } from "tailwind-merge";
import { useSidebarContext } from "../context/SidebarContext";
import { PageHeaderFirstSection } from "../layouts/PageHeader";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getCurrentUserDetails } from "../features/userSlice";

const Sidebar = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const user = useAppSelector(getCurrentUserDetails);
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);

  return (
    <>
      <aside
        className={`sticky top-0 overflow-y-auto scrollbar-hidden flex flex-col ml-1 ${
          isLargeOpen ? "lg:hidden" : "lg:flex"
        }`}
      ></aside>
      {isSmallOpen && (
        <div
          onClick={close}
          className="lg:hidden fixed inset-0 z-[999] bg-black/60 "
        />
      )}
      <aside
        className={`w-56 max-h-screen lg:sticky absolute top-0 overflow-y-full scrollbar-hidden flex-col  border-r ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${
          isSmallOpen
            ? "flex z-[999] bg-main-primary dark:bg-dark-primary dark:text-slate-400 min-h-screen "
            : "hidden"
        }`}
      >
        <div className="lg:hidden border-b p-2 sticky ">
          <PageHeaderFirstSection />
        </div>
        <LargeSidebarSection>
          <LargeSidebarItem
            isActive={currentPath === "/"}
            Icon={Home}
            title="Home"
            url="/"
          />
          {access_token && (
            <>
              <LargeSidebarItem
                isActive={currentPath === "/cart"}
                Icon={ShoppingCart}
                title="Cart"
                url="/cart"
              />
              <LargeSidebarItem
                isActive={currentPath === "/account"}
                Icon={UserCircle2Icon}
                title="Account"
                url="/account"
              />
              <LargeSidebarItem
                isActive={currentPath === "/order-history"}
                Icon={HistoryIcon}
                title="Order History"
                url="/order-history"
              />
              <LargeSidebarItem
                isActive={currentPath === "/booklists"}
                Icon={BookTextIcon}
                title="My Booklists"
                url="/booklists"
              />
              {user.isAdmin && (
                <LargeSidebarItem
                  isActive={currentPath === "/admin"}
                  Icon={ShieldCheckIcon}
                  title="Admin Panel"
                  url="/admin"
                />
              )}
            </>
          )}
          <LargeSidebarItem
            isActive={currentPath === "/public-booklists"}
            Icon={BookOpen}
            title="Public Booklists"
            url="/public-booklists"
          />
          <LargeSidebarItem
            isActive={currentPath === "/about"}
            Icon={InfoIcon}
            title="About Us"
            url="/about"
          />
        </LargeSidebarSection>
        <hr />
      </aside>
    </>
  );
};

export default Sidebar;

type SectionProps = {
  children: ReactNode;
  title?: string;
  visibleItemCount?: number;
};

function LargeSidebarSection({
  children,
  title,
  visibleItemCount = Number.POSITIVE_INFINITY,
}: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = Children.toArray(children).flat();
  const showExpandButton = childrenArray.length > visibleItemCount;
  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, visibleItemCount);
  const ButtonIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div>
      {title && <div className="ml-4 mt-2 text-lg mb-1">{title}</div>}
      {visibleChildren}
      {showExpandButton && (
        <Button
          onClick={() => setIsExpanded((prev) => !prev)}
          variant="ghost"
          className="w-full flex items-center rounded-lg gap-4 p-3"
        >
          <div className="flex">
            <div className="flex flex-col">
              <ButtonIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div>{isExpanded ? "Show Less" : "Show More"}</div>
            </div>
          </div>
        </Button>
      )}
    </div>
  );
}

type LargeProps = {
  Icon: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
};

function LargeSidebarItem({ Icon, title, url, isActive = false }: LargeProps) {
  const { close } = useSidebarContext();
  return (
    <Link
      to={url}
      //onClick={close}
      className={twMerge(
        buttonStyles({ variant: "ghost" }),
        `w-full flex items-center rounded-sm gap-4 p-3 transition-all ease-in-out ${
          isActive ? " text-lg bg-black/20" : ""
        }`
      )}
    >
      {typeof Icon === "string" ? (
        <img src={Icon} alt="icon" className="w-6 h-6 rounded-full" />
      ) : (
        <Icon className="w-6 h-6" />
      )}
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </Link>
  );
}
