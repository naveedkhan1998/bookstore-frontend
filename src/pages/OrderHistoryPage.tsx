import React from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { TransactionObject, Transactions } from "../comman-types";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess } = useGetTransactionsQuery(access_token);

  // Declare transactions outside the if block
  let transactions: Transactions = {};

  if (isSuccess) {
    const transactionsData: TransactionObject = data;
    transactions = transactionsData.transactions;
  }

  return (
    <div className="flex flex-col p-6 w-full overflow-auto text-gray-800 gap-4 ">
      {isSuccess &&
        transactions &&
        Object.keys(transactions)
          .reverse() // Reverse the order
          .map((key) => {
            const entry = transactions[key];
            return (
              <div
                className="grid grid-cols-[auto,fr] flex-grow-1 items-center shadow-2xl p-6 rounded-2xl bg-zinc-400"
                key={key}
              >
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] m-6">
                  <div className="flex flex-col">
                    <h3>
                      Transaction ID: <b>{key}</b>
                    </h3>
                    <p>
                      Amount Paid: <b>${entry.price.toFixed(2)}</b>
                    </p>

                    <p>
                      Items:{" "}
                      <Link to="/order-items" state={{ items: entry }}>
                        <b>Click to View Items</b>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default OrderHistoryPage;
