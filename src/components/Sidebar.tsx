import React, { Children, ElementType, ReactNode, useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
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
import Button, { buttonStyles } from "./ui/Button";
import { useSidebarContext } from "../context/SidebarContext";
import { PageHeaderFirstSection } from "../layouts/PageHeader";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getCurrentUserDetails } from "../features/userSlice";

// Types
interface SidebarProps {
  className?: string;
}

interface SectionProps {
  children: ReactNode;
  title?: string;
  visibleItemCount?: number;
}

interface SidebarItemProps {
  Icon: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Navigation items configuration
const getNavigationItems = (currentPath: string) => [
  {
    Icon: Home,
    title: "Home",
    url: "/",
    isActive: currentPath === "/",
    showAlways: true,
  },
  {
    Icon: ShoppingCart,
    title: "Cart",
    url: "/cart",
    isActive: currentPath === "/cart",
    requiresAuth: true,
  },
  {
    Icon: UserCircle2Icon,
    title: "Account",
    url: "/account",
    isActive: currentPath === "/account",
    requiresAuth: true,
  },
  {
    Icon: HistoryIcon,
    title: "Order History",
    url: "/order-history",
    isActive: currentPath === "/order-history",
    requiresAuth: true,
  },
  {
    Icon: BookTextIcon,
    title: "My Booklists",
    url: "/booklists",
    isActive: currentPath === "/booklists",
    requiresAuth: true,
  },
  {
    Icon: ShieldCheckIcon,
    title: "Admin Panel",
    url: "/admin",
    isActive: currentPath === "/admin",
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    Icon: BookOpen,
    title: "Public Booklists",
    url: "/public-booklists",
    isActive: currentPath === "/public-booklists",
    showAlways: true,
  },
  {
    Icon: InfoIcon,
    title: "About Us",
    url: "/about",
    isActive: currentPath === "/about",
    showAlways: true,
  },
];

// Memoized Components
const SidebarOverlay = memo<{ onClose: () => void }>(({ onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[999] bg-black/60 lg:hidden"
  />
));

const LargeSidebarItem = memo<SidebarItemProps>(
  ({ Icon, title, url, isActive = false, onClick }) => (
    <Link
      to={url}
      onClick={onClick}
      className={twMerge(
        buttonStyles({ variant: "ghost" }),
        "w-full flex items-start h-fit justify-start rounded-sm gap-4 p-3 transition-all ease-in-out",
        isActive && "text-lg bg-black/20",
      )}
    >
      {typeof Icon === "string" ? (
        <img
          src={Icon}
          alt={`${title} icon`}
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <Icon className="w-6 h-6" />
      )}
      <div className="overflow-hidden whitespace-nowrap text-ellipsis">
        {title}
      </div>
    </Link>
  ),
);

const LargeSidebarSection = memo<SectionProps>(
  ({ children, title, visibleItemCount = Number.POSITIVE_INFINITY }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const childrenArray = Children.toArray(children).flat();
    const showExpandButton = childrenArray.length > visibleItemCount;
    const visibleChildren = isExpanded
      ? childrenArray
      : childrenArray.slice(0, visibleItemCount);
    const ButtonIcon = isExpanded ? ChevronUp : ChevronDown;

    return (
      <div>
        {title && <div className="mt-2 mb-1 ml-4 text-lg">{title}</div>}
        {visibleChildren}
        {showExpandButton && (
          <Button
            onClick={() => setIsExpanded((prev) => !prev)}
            variant="ghost"
            className="flex items-center w-full gap-4 p-3 rounded-lg"
          >
            <ButtonIcon className="w-6 h-6" />
            <span>{isExpanded ? "Show Less" : "Show More"}</span>
          </Button>
        )}
      </div>
    );
  },
);

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const accessToken = useAppSelector(getCurrentToken);
  const user = useAppSelector(getCurrentUserDetails);

  const navigationItems = getNavigationItems(location.pathname);

  const filteredNavItems = navigationItems.filter(
    (item) =>
      item.showAlways ||
      (accessToken &&
        item.requiresAuth &&
        (!item.requiresAdmin || user.isAdmin)),
  );

  const CollapsedSidebar = (
    <aside
      className={`sticky top-0 overflow-y-auto scrollbar-hidden flex flex-col ml-1 ${
        isLargeOpen ? "lg:hidden" : "lg:flex"
      }`}
    />
  );

  const ExpandedSidebar = (
    <aside
      className={twMerge(
        "w-56 max-h-screen lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden flex-col",
        "bg-main-secondary dark:bg-dark-secondary text-main-text dark:text-dark-text",
        isLargeOpen ? "lg:flex" : "lg:hidden",
        isSmallOpen ? "flex z-[999] min-h-screen" : "hidden",
      )}
    >
      <div className="sticky p-2 lg:hidden">
        <PageHeaderFirstSection />
      </div>
      <LargeSidebarSection>
        {filteredNavItems.map((item) => (
          <LargeSidebarItem
            key={item.url}
            Icon={item.Icon}
            title={item.title}
            url={item.url}
            isActive={item.isActive}
            onClick={isSmallOpen ? close : undefined}
          />
        ))}
      </LargeSidebarSection>
      <hr className="border-main-text dark:border-dark-text" />
    </aside>
  );

  return (
    <>
      {CollapsedSidebar}
      {isSmallOpen && <SidebarOverlay onClose={close} />}
      {ExpandedSidebar}
    </>
  );
};

export default memo(Sidebar);
