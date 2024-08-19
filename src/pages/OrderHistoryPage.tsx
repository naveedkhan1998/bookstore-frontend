import React, { useState, useMemo } from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { getCurrentToken } from "../features/authSlice";
import { Transactions } from "../comman-types";
import { Link } from "react-router-dom";
import { Button, Card, Pagination, Spinner, TextInput } from "flowbite-react";
import { useAppSelector } from "../app/hooks";
import { ShoppingBag, Calendar } from "lucide-react";
import { customPaginationTheme } from "../custom-themes";

const OrderHistoryPage: React.FC = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, isLoading, isError } = useGetTransactionsQuery(access_token);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    const transactions: Transactions = data?.transactions || {};
    return Object.entries(transactions).filter(([key, entry]) => key.toLowerCase().includes(searchTerm.toLowerCase()) || entry.price.toString().includes(searchTerm));
  }, [data?.transactions, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(filteredTransactions.length / itemsPerPage), [filteredTransactions]);

  const currentTransactions = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTransactions, currentPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center ">Order History</h1>

      <div className="relative mb-6">
        <TextInput
          id="search"
          type="text"
          placeholder="Search by Transaction ID or Amount"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-4 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute text-gray-500 right-3 top-3 hover:text-gray-700"
          >
            &times;
          </button>
        )}
      </div>

      {isSuccess && filteredTransactions.length > 0 && !isError ? (
        <>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {currentTransactions.map(([key, entry]) => (
              <Card key={key} className="transition-shadow duration-300 shadow-lg bg-main-secondary dark:bg-dark-secondary text-main-text dark:text-dark-text hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="text-blue-500" size={24} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="inline mr-1" size={16} />
                  </span>
                </div>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Transaction ID: <span className="text-blue-500">{key.slice(10)}</span>
                </h5>
                <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
                  Amount Paid: <span className="font-bold text-green-500">${entry.price.toFixed(2)}</span>
                </p>
                <Link to="/order-items" state={{ items: entry }}>
                  <Button color="blue" className="w-full">
                    View Items
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons={true} theme={customPaginationTheme} />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">No transactions found.</div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
