import React, { useState } from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { TransactionObject, Transactions } from "../comman-types";
import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";

const OrderHistoryPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess } = useGetTransactionsQuery(access_token);

  const itemsPerPage = 3; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  let transactions: Transactions = {};

  if (isSuccess) {
    const transactionsData: TransactionObject = data;
    transactions = transactionsData.transactions;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = Object.keys(transactions)
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col p-6 w-full overflow-auto text-gray-800 gap-4 ">
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          {
            length: Math.ceil(Object.keys(transactions).length / itemsPerPage),
          },
          (_, index) => (
            <Button
              key={index}
              className={`mx-2 p-2 border ${
                currentPage === index + 1 ? "bg-blue-500 text-gray" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
      {isSuccess &&
        currentTransactions.map((key) => {
          const entry = transactions[key];
          return (
            <div>
              <Card
                className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(275px,1fr))] overflow-hidden pb-12 pt-12 items-center shadow-2xl p-6 rounded-2xl bg-main-secondary dark:bg-dark-secondary"
                
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
                  Transaction ID: <b>{key}</b>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Amount Paid: <b>${entry.price.toFixed(2)}</b>
                </p>
                <Link to="/order-items" state={{ items: entry }}>
                  <Button>Click to View Items</Button>
                </Link>
              </Card>
            </div>
          );
        })}
    </div>
  );
};

export default OrderHistoryPage;
