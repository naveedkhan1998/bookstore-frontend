import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useRemoveWholeItemFromCartMutation,
} from "@/services/api/cart";
import { useLazyGetVolumeQuery } from "@/services/api/googleBooks";
import type { BookVolume } from "@/shared/types/api";

export interface CartTotals {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
}

export interface UseCartReturn {
  // Data
  cartData: ReturnType<typeof useGetCartQuery>["data"];
  volumes: Record<string, BookVolume>;
  validBooks: BookVolume[];
  bookIds: string[];
  totals: CartTotals;
  
  // Loading states
  isFetching: boolean;
  loadingVolumes: boolean;
  isCartEmpty: boolean;
  
  // Actions
  handleIncrement: (id: string) => Promise<void>;
  handleDecrement: (id: string) => Promise<void>;
  handleRemove: (id: string) => Promise<void>;
  handleBookClick: (id: string) => void;
  handleCheckout: () => void;
}

const TAX_RATE = 0.1;

export function useCart(): UseCartReturn {
  const navigate = useNavigate();
  const access_token = useAppSelector(getCurrentToken);

  const [totals, setTotals] = useState<CartTotals>({
    subTotal: 0,
    tax: 0,
    total: 0,
    currency: "",
  });
  const [loadingVolumes, setLoadingVolumes] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, BookVolume>>({});

  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeWholeItemFromCart] = useRemoveWholeItemFromCartMutation();
  const {
    data: cartData,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);
  const [fetchVolume] = useLazyGetVolumeQuery();

  const handleIncrement = useCallback(async (id: string) => {
    try {
      await addToCart({ book_id: { book_id: id }, access_token });
      toast.success("Quantity increased");
      refetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  }, [addToCart, access_token, refetchCart]);

  const handleDecrement = useCallback(async (id: string) => {
    try {
      await removeFromCart({ book_id: { book_id: id }, access_token });
      toast.success("Quantity decreased");
      refetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  }, [removeFromCart, access_token, refetchCart]);

  const handleRemove = useCallback(async (id: string) => {
    try {
      await removeWholeItemFromCart({ book_id: { book_id: id }, access_token });
      toast.success("Item removed from cart");
      refetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  }, [removeWholeItemFromCart, access_token, refetchCart]);

  const handleBookClick = useCallback((id: string) => {
    navigate(`/book/${id}`);
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    navigate("/checkout", {
      state: { to: { items: cartData?.books ?? {}, price: totals.total } },
    });
  }, [navigate, cartData?.books, totals.total]);

  // Load book volumes when cart data changes
  useEffect(() => {
    const loadVolumes = async () => {
      const ids = Object.keys(cartData?.books ?? {});
      if (ids.length === 0) {
        setVolumes({});
        return;
      }

      setLoadingVolumes(true);
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const volume = await fetchVolume(id).unwrap();
            return [id, volume] as const;
          } catch (error) {
            console.error("Failed to load volume", id, error);
            return null;
          }
        }),
      );

      const entries = results.filter(
        (entry): entry is [string, BookVolume] => Boolean(entry),
      );
      setVolumes(Object.fromEntries(entries));
      setLoadingVolumes(false);
    };

    loadVolumes();
  }, [cartData, fetchVolume]);

  const bookIds = useMemo(
    () => Object.keys(cartData?.books ?? {}),
    [cartData?.books],
  );

  // Calculate totals when volumes or cart data changes
  useEffect(() => {
    if (!cartData) {
      setTotals({ subTotal: 0, tax: 0, total: 0, currency: "" });
      return;
    }

    let newSubtotal = 0;
    let currencyCode = "";

    bookIds.forEach((id) => {
      const book = volumes[id];
      const qty = cartData.books?.[id] ?? 0;
      if (book?.saleInfo.listPrice && qty > 0) {
        newSubtotal += book.saleInfo.listPrice.amount * qty;
        currencyCode = book.saleInfo.listPrice.currencyCode;
      }
    });

    const newTax = newSubtotal * TAX_RATE;
    const newTotal = newSubtotal + newTax;

    setTotals({
      subTotal: newSubtotal,
      tax: newTax,
      total: newTotal,
      currency: currencyCode,
    });
  }, [cartData, volumes, bookIds]);

  const validBooks = useMemo(
    () => bookIds.map((id) => volumes[id]).filter(Boolean) as BookVolume[],
    [bookIds, volumes],
  );
  
  const isCartEmpty = !validBooks.length;

  return {
    cartData,
    volumes,
    validBooks,
    bookIds,
    totals,
    isFetching,
    loadingVolumes,
    isCartEmpty,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleBookClick,
    handleCheckout,
  };
}

export default useCart;
