import React from "react";
import { useLocation } from "react-router-dom";
import { Transactions } from "../comman-types";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";

const OrderItemsPage = () => {
  const location = useLocation();
  const { items } = location.state;

  const entry: any = items;
  console.log(entry)

  return (
    <Modal>
      <div className="grid grid-cols-[auto,fr] flex-grow-1  w-full h-full items-center shadow-2xl p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-2 mt-10 p-6 ">Order Items:</h1>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {Object.keys(entry.items).map((itemKey) => (
            <div className="flex flex-col items-center justify-center">
            <BookComponent key={itemKey} book_id={itemKey} />
            <p>Quantity: {entry.items[itemKey]}</p>
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-2 mt-10 p-6 ">Total Price: {entry.price.toFixed(2)}</h1>
      </div>
    </Modal>
  );
};

export default OrderItemsPage;
