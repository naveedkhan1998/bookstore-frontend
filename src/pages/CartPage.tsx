import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, PackageOpen } from "lucide-react";
import PageContent from "@/shared/layouts/PageContent";
import { LoadingState, EmptyState, Grid } from "@/shared/layouts/ContentComponents";
import { CartItem, OrderSummary } from "@/features/cart/components";
import { useCart } from "@/features/cart/hooks/useCart";

const CartPage: FC = () => {
  const navigate = useNavigate();
  const {
    cartData,
    validBooks,
    totals,
    isFetching,
    loadingVolumes,
    isCartEmpty,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleBookClick,
    handleCheckout,
  } = useCart();

  if ((isFetching || loadingVolumes) && validBooks.length === 0) {
    return <LoadingState />;
  }

  return (
    <PageContent
      title="Your Cart"
      subtitle={
        !isCartEmpty
          ? `${validBooks.length} item${validBooks.length !== 1 ? "s" : ""} in cart`
          : undefined
      }
      icon={ShoppingCart}
    >
      {isCartEmpty ? (
        <EmptyState
          icon={<PackageOpen className="w-16 h-16" />}
          title="Your cart is empty"
          description="Start shopping to add items to your cart"
          action={
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 text-white transition-all rounded-lg bg-secondary hover:bg-secondary-hover"
            >
              Continue Shopping
            </button>
          }
        />
      ) : (
        <Grid cols={{ default: 1, lg: 3 }} className="gap-8">
          <div className="space-y-4 lg:col-span-2">
            {validBooks.map((book) => (
              <CartItem
                key={book.id}
                book={book}
                quantity={cartData?.books[book.id] ?? 0}
                onIncrement={() => handleIncrement(book.id)}
                onDecrement={() => handleDecrement(book.id)}
                onRemove={() => handleRemove(book.id)}
                onClick={() => handleBookClick(book.id)}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                subTotal={totals.subTotal}
                tax={totals.tax}
                total={totals.total}
                currency={totals.currency}
                onCheckout={handleCheckout}
                disabled={totals.total <= 0}
              />
            </div>
          </div>
        </Grid>
      )}
    </PageContent>
  );
};

export default CartPage;
