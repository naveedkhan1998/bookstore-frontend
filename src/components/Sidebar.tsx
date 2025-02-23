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
        "w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg",
        "transition-all duration-200 group relative",
        isActive
          ? "bg-blue-500 text-white"
          : "hover:bg-slate-100 dark:hover:bg-slate-800",
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
          className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
        />
      )}
      <span className="font-medium">{title}</span>
      {isActive && (
        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <h3 className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </h3>
        )}
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
          "w-64 max-h-screen lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden flex-col",
          "bg-white dark:bg-slate-900 border-r dark:border-slate-800",
          isLargeOpen ? "lg:flex" : "lg:hidden",
          isSmallOpen ? "flex z-[999] min-h-screen" : "hidden",
          "lg:bg-white lg:dark:bg-slate-900",
          "bg-main-secondary dark:bg-dark-secondary",
        )}
      >
        <div className="sticky top-0 bg-main-secondary dark:bg-dark-secondary lg:bg-transparent p-2 lg:hidden">
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
          <div className="p-4 border-t dark:border-slate-700">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <UserCircle2Icon className="w-8 h-8 text-slate-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.given_name} {user.family_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default memo(Sidebar);
