import React, { useState, useMemo } from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { getCurrentToken } from "../features/authSlice";
import { TransactionObject, Transactions } from "../comman-types";
import { Link } from "react-router-dom";
import { Button, Card, Pagination } from "flowbite-react";
import { useAppSelector } from "../app/hooks";

const OrderHistoryPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess } = useGetTransactionsQuery(access_token);

  const itemsPerPage = 10; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  const transactions: Transactions = data?.transactions || {};

  const totalPages = useMemo(
    () => Math.ceil(Object.keys(transactions).length / itemsPerPage),
    [transactions]
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = Object.keys(transactions)
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container p-6 w-full overflow-auto text-gray-800 gap-4">
      <div className="flex text-xs justify-center  ">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          theme={{
            pages: {
              selector: {
                active: "",
              },
            },
          }}
        />
      </div>

      {isSuccess && (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(auto,1fr))] overflow-hidden items-normal justify-normal border p-6 rounded-md bg-main-secondary dark:bg-dark-secondary">
          {currentTransactions.map((key) => {
            const entry = transactions[key];
            return (
              <Card key={key} className="bg-main-primary dark:bg-dark-primary">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
                  Transaction ID: <b>{key.slice(10)}</b>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Amount Paid: <b>${entry.price.toFixed(2)}</b>
                </p>
                <Link to="/order-items" state={{ items: entry }}>
                  <Button>Click to View Items</Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
