// Main layout components
export { default as MainLayout } from "./MainLayout";
export { default as PageContent } from "./PageContent";
export { default as PageHeader } from "./PageHeader";
export { default as Footer } from "./Footer";

// Content components for building pages
export {
  Section,
  ContentCard,
  Grid,
  EmptyState,
  LoadingState,
  ErrorState,
} from "./ContentComponents";

// Re-export types if needed
export type { PageContentProps } from "./PageContent";
