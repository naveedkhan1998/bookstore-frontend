import { useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import BookComponent from "@/features/books/components/BookComponent";
import Modal from "@/shared/components/overlay/Modal";
import PageContent from "@/shared/layouts/PageContent";
import { Grid } from "@/shared/layouts/ContentComponents";

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
