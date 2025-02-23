import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useGetPublicBooklistsQuery } from "../services/booklistsServices";
import {
  getPublicBooklists,
  setPublicBookslist,
} from "../features/publicBooklistSlice";
import { Link } from "react-router-dom";
import Card from "../components/ui/card/card.component";

const PublicBooklistsPage = () => {
  const dispatch = useAppDispatch();
  const { data, isSuccess, isLoading, isError, refetch } =
    useGetPublicBooklistsQuery("");
  const booklists = useAppSelector(getPublicBooklists);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setPublicBookslist(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">
          Failed to load public booklists. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Public Booklists
            <span className="ml-2 text-sm text-gray-500">(Limited to 10)</span>
          </h1>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {booklists && booklists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No public booklists available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {booklists?.map((bookList) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBooklistsPage;
