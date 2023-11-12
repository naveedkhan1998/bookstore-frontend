import {
  ChevronDown,
  ChevronUp,
  Home,
  ShoppingCart,
  UserCircle2Icon,
  HistoryIcon,
} from "lucide-react";
import React, { Children, ElementType, ReactNode, useState } from "react";
import Button, { buttonStyles } from "./Button";
import { twMerge } from "tailwind-merge";
import { useSidebarContext } from "../context/SidebarContext";
import { PageHeaderFirstSection } from "../layouts/PageHeader";

const Sidebar = () => {
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  return (
    <>
      {isSmallOpen && (
        <div
          onClick={close}
          className="lg:hidden fixed inset-0 z-[999] bg-dark opacity-50"
        />
      )}
      <aside
        className={`w-56 h-full lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 py-4 ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${isSmallOpen ? "flex z-[999] bg-slate-200 max-h-screen" : "hidden"}`}
      >
        <div className="lg:hidden pt-2 pb-4 px2 sticky top-0 bg-slate-200">
          <PageHeaderFirstSection />
        </div>
        <LargeSidebarSection visibleItemCount={3}>
          <LargeSidebarItem isActive Icon={Home} title="Home" url="/" />
          <LargeSidebarItem Icon={ShoppingCart} title="Cart" url="/cart" />
          <LargeSidebarItem
            Icon={UserCircle2Icon}
            title="Account"
            url="/account"
          />
          <LargeSidebarItem
            Icon={HistoryIcon}
            title="Order History"
            url="/order-history"
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
          onClick={() => setIsExpanded((e) => !e)}
          variant="default"
          className="w-full flex items-center rounded-lg gap-4 p-3"
        >
          <ButtonIcon className="w-6 h-6"></ButtonIcon>
          <div>{isExpanded ? "Show Less" : "Show More"}</div>
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
  return (
    <a
      href={url}
      className={twMerge(
        buttonStyles({ variant: "ghost" }),
        `w-full flex items-center rounded-lg gap-4 p-3 ${
          isActive ? "font-bold hover:bg-secondary" : undefined
        }`
      )}
    >
      {typeof Icon === "string" ? (
        <img src={Icon} alt="icon" className="w-6 h-6 rounded-full "></img>
      ) : (
        <Icon className="w-6 h-6" />
      )}
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </a>
  );
}
