import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

type LazyComponent = LazyExoticComponent<ComponentType<any>>;

export type RouteDefinition = {
  path: string;
  component: LazyComponent;
};

export const publicRoutes: RouteDefinition[] = [
  { path: "/", component: lazy(() => import("@/pages/HomePage")) },
  {
    path: "/auth",
    component: lazy(() => import("@/features/auth/components/LoginReg")),
  },
  {
    path: "/login",
    component: lazy(() => import("@/features/auth/components/Login")),
  },
  {
    path: "/registration",
    component: lazy(() => import("@/features/auth/components/Registration")),
  },
  { path: "/about", component: lazy(() => import("@/pages/AboutPage")) },
  { path: "/book/:id", component: lazy(() => import("@/pages/BookPage")) },
];

export const protectedRoutes: RouteDefinition[] = [
  {
    path: "/home",
    component: lazy(() => import("@/pages/HomePage")),
  },
  {
    path: "/cart",
    component: lazy(() => import("@/pages/CartPage")),
  },
  {
    path: "/account",
    component: lazy(() => import("@/pages/UserProfilePage")),
  },
  {
    path: "/order-history",
    component: lazy(() => import("@/pages/OrderHistoryPage")),
  },
  {
    path: "/order-items",
    component: lazy(() => import("@/pages/OrderItemsPage")),
  },
  {
    path: "/checkout",
    component: lazy(() => import("@/pages/CheckoutPage")),
  },
  {
    path: "/admin",
    component: lazy(() => import("@/pages/AdminPage")),
  },
  {
    path: "/admin-user-page",
    component: lazy(() => import("@/pages/AdminUserPage")),
  },
  {
    path: "/booklists",
    component: lazy(() => import("@/pages/BooklistPageAuth")),
  },
  {
    path: "/user-booklist/:id",
    component: lazy(() => import("@/pages/UserBooklistPage")),
  },
  {
    path: "/setting",
    component: lazy(() => import("@/pages/UserSettingPage")),
  },
];

export const publicBooklistsRoute = {
  path: "/public-booklists",
  authenticated: lazy(() => import("@/pages/AuthenticatedBooklistPage")),
  unauthenticated: lazy(() => import("@/pages/PublicBooklistsPage")),
};

export const publicBookRoute = {
  path: "/public-booklist",
  component: lazy(() => import("@/pages/PublicBookPage")),
};
