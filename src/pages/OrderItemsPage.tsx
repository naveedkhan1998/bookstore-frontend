import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";

const OrderItemsPage = () => {
  const location = useLocation();
  const { items } = location.state;

  const entry = items;

  return (
    <Modal>
      <div className="grid grid-cols-[auto,fr] w-full h-full items-center p-6">
        <h1 className="p-6 mb-2 text-2xl font-bold ">Order Items</h1>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {Object.keys(entry.items).map((itemKey) => (
            <div className="flex flex-col items-center justify-center">
              <BookComponent key={itemKey} book_id={itemKey} />
              <p className="pt-6">Quantity: {entry.items[itemKey]}</p>
            </div>
          ))}
        </div>
        <h1 className="p-6 mt-10 text-2xl font-bold border rounded-md ">
          Total Price: {entry.price.toFixed(2)} $
        </h1>
      </div>
    </Modal>
  );
};

export default OrderItemsPage;
