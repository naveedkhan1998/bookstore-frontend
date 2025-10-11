import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

type LazyComponent = LazyExoticComponent<ComponentType<any>>;

export type RouteDefinition = {
  path: string;
  component: LazyComponent;
  requiresAuth?: boolean;
};

export const routeConfig: RouteDefinition[] = [
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
  {
    path: "/home",
    component: lazy(() => import("@/pages/HomePage")),
    requiresAuth: true,
  },
  {
    path: "/cart",
    component: lazy(() => import("@/pages/CartPage")),
    requiresAuth: true,
  },
  {
    path: "/account",
    component: lazy(() => import("@/pages/UserProfilePage")),
    requiresAuth: true,
  },
  {
    path: "/order-history",
    component: lazy(() => import("@/pages/OrderHistoryPage")),
    requiresAuth: true,
  },
  {
    path: "/order-items",
    component: lazy(() => import("@/pages/OrderItemsPage")),
    requiresAuth: true,
  },
  {
    path: "/checkout",
    component: lazy(() => import("@/pages/CheckoutPage")),
    requiresAuth: true,
  },
  {
    path: "/admin",
    component: lazy(() => import("@/pages/AdminPage")),
    requiresAuth: true,
  },
  {
    path: "/admin-user-page",
    component: lazy(() => import("@/pages/AdminUserPage")),
    requiresAuth: true,
  },
  {
    path: "/booklists",
    component: lazy(() => import("@/pages/BooklistPageAuth")),
    requiresAuth: true,
  },
  {
    path: "/user-booklist/:id",
    component: lazy(() => import("@/pages/UserBooklistPage")),
    requiresAuth: true,
  },
  {
    path: "/book/:id",
    component: lazy(() => import("@/pages/BookPage")),
  },
  {
    path: "/item/:id",
    component: lazy(() => import("@/pages/ItemPage")),
    requiresAuth: true,
  },
  {
    path: "/setting",
    component: lazy(() => import("@/pages/UserSettingPage")),
    requiresAuth: true,
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
