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
import Button from "./ui/button/Button";
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

interface NavigationItem {
  Icon: ElementType | string;
  title: string;
  url: string;
  isActive: boolean;
  showAlways?: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

interface NavigationSection {
  section: string;
  items: NavigationItem[];
}

// Navigation items configuration
const getNavigationItems = (currentPath: string): NavigationSection[] => [
  {
    section: "Main",
    items: [
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
    ],
  },
  {
    section: "Personal",
    items: [
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
    ],
  },
  {
    section: "Explore",
    items: [
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
    ],
  },
  {
    section: "Admin",
    items: [
      {
        Icon: ShieldCheckIcon,
        title: "Admin Panel",
        url: "/admin",
        isActive: currentPath === "/admin",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
  },
];

// Memoized Components
const SidebarOverlay = memo<{ onClose: () => void }>(({ onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm lg:hidden animate-fadeIn"
  />
));
SidebarOverlay.displayName = "SidebarOverlay";

const LargeSidebarItem = memo<SidebarItemProps>(
  ({ Icon, title, url, isActive = false, onClick }) => (
    <Link
      to={url}
      onClick={onClick}
      className={twMerge(
        "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-brand-primary/20 text-white shadow-lg "
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-tertiary",
      )}
    >
      <div
        className={twMerge(
          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
          isActive
            ? "bg-white/10 border"
            : "bg-gray-100 dark:bg-dark-tertiary group-hover:bg-gray-200 dark:group-hover:bg-gray-700",
        )}
      >
        {typeof Icon === "string" ? (
          <img
            src={Icon}
            alt={`${title} icon`}
            className="w-5 h-5 rounded-full bg-inherit"
          />
        ) : (
          <Icon
            className={twMerge("h-5 w-5 transition-transform duration-200")}
          />
        )}
      </div>
      <span className="flex-1">{title}</span>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
      )}
    </Link>
  ),
);
LargeSidebarItem.displayName = "LargeSidebarItem";

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
      <div className="mb-6">
        {title && (
          <h3 className="px-4 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </h3>
        )}
        <div className="space-y-1">{visibleChildren}</div>
        {showExpandButton && (
          <Button
            onClick={() => setIsExpanded((prev) => !prev)}
            variant="ghost"
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-sm 
                     text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-tertiary
                     transition-all duration-200"
          >
            <ButtonIcon className="w-4 h-4" />
            <span className="font-medium">
              {isExpanded ? "Show Less" : "Show More"}
            </span>
          </Button>
        )}
      </div>
    );
  },
);
LargeSidebarSection.displayName = "LargeSidebarSection";

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const accessToken = useAppSelector(getCurrentToken);
  const user = useAppSelector(getCurrentUserDetails);

  const navigationSections = getNavigationItems(location.pathname);

  const filteredNavSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.showAlways ||
          (accessToken &&
            item.requiresAuth &&
            (!item.requiresAdmin || user?.isAdmin)),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {isSmallOpen && <SidebarOverlay onClose={close} />}
      <aside
        className={twMerge(
          "w-72 shrink-0 flex flex-col",
          "bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-gray-800",
          "shadow-lg lg:shadow-none",
          isSmallOpen
            ? "fixed inset-y-0 left-0 z-[999] animate-slideInLeft"
            : "hidden",
          isLargeOpen ? "lg:flex" : "lg:hidden",
        )}
      >
        <div
          className="flex-shrink-0 bg-white dark:bg-dark-secondary border-b border-gray-200 
                      dark:border-gray-800 p-4 lg:hidden"
        >
          <PageHeaderFirstSection />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 space-y-2">
          {filteredNavSections.map((section, index) => (
            <LargeSidebarSection key={index} title={section.section}>
              {section.items.map((item) => (
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
          ))}
        </div>

        {user && (
          <div
            className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4 
                        bg-white dark:bg-dark-secondary"
          >
            <div
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-brand-primary 
                          to-brand-secondary text-white shadow-lg"
            >
              <img
                src={user.avatarUrl}
                alt={`${user.given_name} ${user.family_name}`}
                className="w-10 h-10 rounded-full ring-2 ring-white/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.given_name} {user.family_name}
                </p>
                <p className="text-xs text-white/80 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
