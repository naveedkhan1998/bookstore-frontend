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
  ChevronRight,
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
    className="fixed inset-0 z-[999] bg-black/60 lg:hidden"
  />
));
SidebarOverlay.displayName = "SidebarOverlay";

const LargeSidebarItem = memo<SidebarItemProps>(
  ({ Icon, title, url, isActive = false, onClick }) => (
    <Link
      to={url}
      onClick={onClick}
      className={twMerge(
        "group relative mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
        "border border-transparent",
        isActive
          ? "bg-secondary text-secondary-text shadow-md"
          : "text-gray-600 dark:text-gray-300 hover:bg-main-tertiary/60 dark:hover:bg-dark-tertiary/70",
      )}
    >
      {typeof Icon === "string" ? (
        <img
          src={Icon}
          alt={`${title} icon`}
          className="w-5 h-5 rounded-full"
        />
      ) : (
        <Icon
          className={`h-5 w-5 ${isActive ? "text-secondary-text" : "text-gray-500 dark:text-gray-400"}`}
        />
      )}
      <span className="font-medium">{title}</span>
      {isActive && (
        <ChevronRight
          className={twMerge(
            "ml-auto h-4 w-4 transition-opacity duration-200",
            isActive
              ? "opacity-100 text-secondary-text"
              : "opacity-0 text-gray-400 group-hover:opacity-100",
          )}
        />
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
      <div className="py-2">
        {title && (
          <h3 className="px-6 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
            {title}
          </h3>
        )}
        {visibleChildren}
        {showExpandButton && (
          <Button
            onClick={() => setIsExpanded((prev) => !prev)}
            variant="ghost"
            className="mt-1 flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-main-primary/60 px-4 py-2 text-sm text-gray-600 transition hover:bg-main-tertiary/60 dark:border-gray-700 dark:bg-dark-tertiary/60 dark:text-gray-200 dark:hover:bg-dark-tertiary"
          >
            <ButtonIcon className="w-6 h-6" />
            <span>{isExpanded ? "Show Less" : "Show More"}</span>
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
          "w-72 shrink-0 overflow-y-auto overflow-x-hidden scrollbar-hidden flex-col rounded-3xl",
          "border border-gray-200 dark:border-gray-800",
          "bg-main-secondary/85 dark:bg-dark-secondary/85 shadow-[0_26px_60px_-42px_rgba(34,32,30,0.55)] backdrop-blur-sm",
          isSmallOpen
            ? "fixed inset-y-0 left-0 z-[999] m-4 flex max-h-[calc(100vh-2rem)] shadow-2xl"
            : "hidden",
          "lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:m-0",
          isLargeOpen ? "lg:flex" : "lg:hidden",
        )}
      >
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-main-secondary p-3 rounded-3xl dark:border-gray-800 dark:bg-dark-secondary lg:hidden">
          <PageHeaderFirstSection />
        </div>

        <div className="flex-1">
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
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3 rounded-2xl bg-main-primary/70 px-4 py-3 dark:bg-dark-tertiary/70">
              <UserCircle2Icon className="h-8 w-8 text-secondary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-100">
                  {user.given_name} {user.family_name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default memo(Sidebar);
