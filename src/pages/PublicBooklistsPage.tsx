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

  const { data, isSuccess, refetch } = useGetPublicBooklistsQuery("");

  // Update data in the Redux store if the query is successful
  useEffect(() => {
    if (isSuccess) {
      dispatch(setPublicBookslist(data));
    }
  }, [isSuccess, data, dispatch]);

  // Fetch data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);

    // Clear the interval when the component unmounts or if refetch changes
    return () => clearInterval(intervalId);
  }, [refetch]);

  const booklists = useAppSelector(getPublicBooklists);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 mx-auto mt-10">
      <div className="grid grid-cols-[auto,fr] flex-grow-1  md:w-[80dvw] w-[95dvw]  shadow-2xl p-6 rounded-2xl border">
        <h1 className="pt-6 pb-6 text-2xl font-bold">
          Public BookLists Limit 10
        </h1>

        {booklists && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {booklists &&
              booklists.map((bookList) => (
                <Link to="/public-booklist" state={{ from: bookList }}>
                  <Card className="max-w-sm bg-main-secondary dark:bg-dark-secondary">
                    <div
                      className="flex flex-wrap w-[250px] h-[100px]"
                      key={bookList.name}
                    >
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-400">
                        Name: {bookList.name}
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        Created By: {bookList.authorName}
                      </p>
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
