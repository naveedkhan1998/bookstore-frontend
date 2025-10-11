import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface PageContentProps {
  /** Main page title */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Icon to display next to the title */
  icon?: LucideIcon;
  /** Actions or buttons to display in the header (e.g., search, filters) */
  headerActions?: ReactNode;
  /** Main content of the page */
  children: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to use full width without max-width constraint */
  fullWidth?: boolean;
  /** Whether to remove padding from content area */
  noPadding?: boolean;
}

/**
 * PageContent - Unified content layout component for consistent page structure
 *
 * Provides a standardized layout for pages with:
 * - Optional page header with title, subtitle, icon, and actions
 * - Consistent spacing and responsive design
 * - Flexible content area
 *
 * @example
 * ```tsx
 * <PageContent
 *   title="My Page"
 *   subtitle="Page description"
 *   icon={Home}
 *   headerActions={<Button>Action</Button>}
 * >
 *   <div>Page content here</div>
 * </PageContent>
 * ```
 */
const PageContent = ({
  title,
  subtitle,
  icon: Icon,
  headerActions,
  children,
  className,
  fullWidth = false,
  noPadding = false,
}: PageContentProps) => {
  const hasHeader = title || subtitle || Icon || headerActions;

  return (
    <div
      className={twMerge(
        "w-full h-full",
        !fullWidth && " mx-auto",
        !noPadding && "",
        className,
      )}
    >
      {/* Page Header */}
      {hasHeader && (
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          {/* Title Section */}
          {(title || subtitle || Icon) && (
            <div className="flex items-start gap-4">
              {Icon && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Header Actions */}
          {headerActions && (
            <div className="flex items-center gap-3 flex-wrap">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="animate-fadeIn">{children}</div>
    </div>
  );
};

export default PageContent;
