import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Library, RefreshCw } from "lucide-react";
import { useGetPublicBooklistsQuery } from "@/services/api/booklists";
import Card from "@/shared/ui/card/Card";
import PageContent from "@/shared/layouts/PageContent";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  Grid,
} from "@/shared/layouts/ContentComponents";

const PublicBooklistsPage = () => {
  const { data, isLoading, isError, refetch } = useGetPublicBooklistsQuery("");
  const booklists = data ?? [];

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState message="Failed to load public booklists. Please try again later." />
    );
  }

  return (
    <PageContent
      title="Public Booklists"
      subtitle="Limited to 10"
      icon={Library}
      headerActions={
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      }
    >
      {booklists && booklists.length === 0 ? (
        <EmptyState title="No public booklists available." />
      ) : (
        <Grid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}>
          {booklists?.map((bookList: { name: string; books: string[]; authorName?: string }) => (
            <Link
              to="/public-booklist"
              state={{ from: bookList }}
              key={bookList.name}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <Card className="h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="p-6">
                  <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {bookList.name}
                  </h5>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                    </svg>
                    {bookList.authorName}
                  </div>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Click to view details
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </Grid>
      )}
    </PageContent>
  );
};

export default PublicBooklistsPage;
