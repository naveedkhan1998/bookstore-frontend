import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetElixirsQuery } from "../services/harryPotterServices";
import { Elixirs } from "../comman-types";
import Button from "./Button";
import { ArrowUp } from "lucide-react";

const FetchTest = () => {
  const { data, isSuccess, refetch } = useGetElixirsQuery("a");
  const pageSize = 24; // Adjust the page size as needed
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = isSuccess ? data.slice(startIndex, endIndex) : [];

  const totalPages = isSuccess ? Math.ceil(data.length / pageSize) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="grid gap-4 grid-cols-[auto-fill,minmax(300px,1fr)]">
      <div className="flex flex-col gap-2">
        {isSuccess && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedData.map((elixir: Elixirs) => (
                <div
                  className="bg-white rounded-lg p-4 shadow-md"
                  key={elixir.id}
                >
                  <h3 className="text-lg font-bold mb-2">
                    Elixir Name: {elixir.name}
                  </h3>
                  <p className="text-sm mb-2">
                    Characteristics: {elixir.characteristics}
                  </p>
                  <p className="text-sm">Effects: {elixir.effect}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size={"icon"}
                    onClick={() => handlePageChange(page)}
                    className={`mx-2 p-2 ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchTest;
