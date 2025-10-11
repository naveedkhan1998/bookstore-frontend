import { useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";
import PageContent from "../layouts/PageContent";
import { Grid } from "../layouts/ContentComponents";

const OrderItemsPage = () => {
  const location = useLocation();
  const { items } = location.state;

  const entry = items;
  const itemCount = Object.keys(entry.items).length;

  return (
    <Modal>
      <PageContent
        title="Order Items"
        subtitle={`${itemCount} item${itemCount !== 1 ? "s" : ""} • Total: $${entry.price.toFixed(2)}`}
        icon={ShoppingBag}
      >
        <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          {Object.keys(entry.items).map((itemKey) => (
            <div
              key={itemKey}
              className="flex flex-col items-center justify-center"
            >
              <BookComponent book_id={itemKey} />
              <p className="pt-6 text-center font-medium">
                Quantity: {entry.items[itemKey]}
              </p>
            </div>
          ))}
        </Grid>
      </PageContent>
    </Modal>
  );
};

export default OrderItemsPage;
