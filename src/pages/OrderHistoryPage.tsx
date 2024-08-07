import React, { useState, useMemo } from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { getCurrentToken } from "../features/authSlice";
import { TransactionObject, Transactions } from "../comman-types";
import { Link } from "react-router-dom";
import { Button, Card, Pagination, Spinner, TextInput } from "flowbite-react";
import { useAppSelector } from "../app/hooks";
import { ShoppingBag, Search, Calendar } from "lucide-react";

const OrderHistoryPage: React.FC = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, isLoading, isError } = useGetTransactionsQuery(access_token);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const transactions: Transactions = data?.transactions || {};

  const filteredTransactions = useMemo(() => {
    return Object.entries(transactions).filter(([key, entry]) => key.toLowerCase().includes(searchTerm.toLowerCase()) || entry.price.toString().includes(searchTerm));
  }, [transactions, searchTerm]);

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

  if (isError) {
    return <div className="mt-10 text-center text-red-500">An error occurred while fetching your order history. Please try again later.</div>;
  }

  return (
    <div className="container max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-white">Order History</h1>

      <div className="mb-6">
        <TextInput id="search" type="text" placeholder="Search by Transaction ID or Amount" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {isSuccess && filteredTransactions.length > 0 ? (
        <>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {currentTransactions.map(([key, entry]) => (
              <Card key={key} className="transition-shadow duration-300 bg-white shadow-lg dark:bg-gray-800 hover:shadow-xl">
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons={true} />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">No transactions found.</div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
