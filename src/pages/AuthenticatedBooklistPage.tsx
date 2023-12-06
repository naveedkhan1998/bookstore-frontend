import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useGetALLBooklistsQuery} from "../services/booklistsServices";
import {
  getPublicBooklists,
  setPublicBookslist,
} from "../features/publicBooklistSlice";
import { Link } from "react-router-dom";

const AuthentiatedBooklistPage = () => {
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);

  const { data, isSuccess, refetch } = useGetALLBooklistsQuery(access_token);

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
    <div className="flex flex-col w-full items-center justify-center p-6 mt-10">
      <div className="grid grid-cols-[auto,fr] flex-grow-1  w-[80dvw]  shadow-2xl p-6 rounded-2xl">
        <h1 className="pt-6 text-2xl font-bold pb-6">
          Authenticated User BookLists No Limit 
        </h1>

        {booklists && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {booklists &&
              booklists.map((bookList) => (
                <div className="flex flex-row" key={bookList.name}>
                  <Link to="/public-booklist" state={{ from: bookList }}>
                    <div
                      id={bookList.name}
                      //onClick={() => handleBooklistClick(bookList)}
                      className="flex flex-col p-6 rounded-lg shadow-lg bg-zinc-400 hover:bg-zinc-500 w-full "
                    >
                      <h2 className="text-lg font-semibold mb-2">
                        Name: {bookList.name}
                      </h2>
                      <p className="text-gray-600">
                        Created By: {bookList.authorName}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthentiatedBooklistPage;