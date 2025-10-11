import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SectionProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Content of the section */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Actions or buttons to display in the section header */
  actions?: ReactNode;
}

/**
 * Section - Content section component for organizing page content
 *
 * @example
 * ```tsx
 * <Section title="Recent Orders" description="Your latest purchases">
 *   <OrderList />
 * </Section>
 * ```
 */
export const Section = ({
  title,
  description,
  children,
  className,
  actions,
}: SectionProps) => {
  const hasHeader = title || description || actions;

  return (
    <section className={twMerge("space-y-4", className)}>
      {hasHeader && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to include hover effects */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * ContentCard - Styled card component for content sections
 *
 * @example
 * ```tsx
 * <ContentCard hoverable onClick={() => navigate('/detail')}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </ContentCard>
 * ```
 */
export const ContentCard = ({
  children,
  className,
  hoverable = false,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-all duration-200",
        hoverable &&
          "hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface GridProps {
  /** Grid items */
  children: ReactNode;
  /** Number of columns (responsive) */
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Gap between items */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Grid - Responsive grid layout component
 *
 * @example
 * ```tsx
 * <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </Grid>
 * ```
 */
export const Grid = ({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className,
}: GridProps) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const gridClass = twMerge(
    "grid",
    cols.default && colClasses[cols.default as keyof typeof colClasses],
    cols.sm && `sm:${colClasses[cols.sm as keyof typeof colClasses]}`,
    cols.md && `md:${colClasses[cols.md as keyof typeof colClasses]}`,
    cols.lg && `lg:${colClasses[cols.lg as keyof typeof colClasses]}`,
    cols.xl && `xl:${colClasses[cols.xl as keyof typeof colClasses]}`,
    `gap-${gap}`,
    className,
  );

  return <div className={gridClass}>{children}</div>;
};

interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button or component */
  action?: ReactNode;
}

/**
 * EmptyState - Component to display when no content is available
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<ShoppingCart />}
 *   title="Your cart is empty"
 *   description="Add some books to get started"
 *   action={<Button>Browse Books</Button>}
 * />
 * ```
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

interface LoadingStateProps {
  /** Loading message */
  message?: string;
}

/**
 * LoadingState - Loading indicator component
 *
 * @example
 * ```tsx
 * <LoadingState message="Loading your orders..." />
 * ```
 */
export const LoadingState = ({ message }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      {message && <p className="text-gray-600 dark:text-gray-400">{message}</p>}
    </div>
  );
};

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message: string;
  /** Retry action */
  onRetry?: () => void;
}

/**
 * ErrorState - Error display component
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load"
 *   message="Unable to fetch orders"
 *   onRetry={refetch}
 * />
 * ```
 */
export const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
