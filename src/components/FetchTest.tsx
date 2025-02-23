import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setElixirs, getElixirs } from "../features/elixirSlice";
import { useNavigate } from "react-router-dom";
import { useGetElixirsQuery } from "../services/harryPotterServices";
import { Elixirs } from "../comman-types";
import Button from "./ui/button/Button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

const FetchTest = () => {
  const { data, isSuccess } = useGetElixirsQuery("a");

  const dispatch = useAppDispatch();

  if (isSuccess) {
    dispatch(setElixirs(data));
  }

  const dataFromStore = useAppSelector(getElixirs);

  const pageSize = 12; // Adjust the page size as needed
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = isSuccess
    ? dataFromStore.slice(startIndex, endIndex)
    : [];

  const totalPages = isSuccess ? Math.ceil(dataFromStore.length / pageSize) : 0;

  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const maxVisiblePages = 3;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    ).map((page) => (
      <Button
        key={page}
        size={"icon"}
        variant={"default"}
        onClick={() => handlePageChange(page)}
        className={`mx-1 my-1 p-2 ${
          page === currentPage ? " text-slate-600" : "bg-gray-200 text-grey"
        } sm:mx-2 sm:my-0`}
      >
        {page}
      </Button>
    ));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {isSuccess && (
          <div>
            <div className="flex flex-wrap justify-center mb-4">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`mx-1 my-1 p-2 ${
                  currentPage === 1 ? "hidden" : " text-slate-600"
                } sm:mx-2 sm:my-0`}
                disabled={currentPage === 1}
              >
                <MoveLeftIcon />
              </Button>
              {renderPageButtons()}
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`mx-1 my-1 p-2 ${
                  currentPage === totalPages ? "hidden" : " text-slate-600"
                } sm:mx-2 sm:my-0`}
                disabled={currentPage === totalPages}
              >
                <MoveRightIcon />
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {paginatedData.map((elixir: Elixirs) => (
                <div
                  className="p-4 mb-4 rounded-lg shadow-md bg-main-secondary dark:bg-dark-secondary"
                  key={elixir.id}
                  onClick={() => handleItemClick(elixir.id)}
                >
                  <h3 className="mb-2 text-base font-bold sm:text-lg md:text-lg lg:text-lg xl:text-lg">
                    Elixir Name: {elixir.name}
                  </h3>
                  <p className="mb-2 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                    Characteristics: {elixir.characteristics}
                  </p>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm">
                    Effects: {elixir.effect}
                  </p>
                </div>
              ))}
            </div>

            {/* <div className="flex flex-wrap justify-center mb-4">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`mx-1 my-1 p-2 ${
                  currentPage === 1 ? "hidden" : " text-slate-600"
                } sm:mx-2 sm:my-0`}
                disabled={currentPage === 1}
              >
                <MoveLeftIcon />
              </Button>
              {renderPageButtons()}
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`mx-1 my-1 p-2 ${
                  currentPage === totalPages ? "hidden" : " text-slate-600"
                } sm:mx-2 sm:my-0`}
                disabled={currentPage === totalPages}
              >
                <MoveRightIcon />
              </Button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchTest;
