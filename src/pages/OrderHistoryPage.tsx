import { useState, useMemo } from "react";
import { useGetTransactionsQuery } from "../services/transactionsServices";
import { getCurrentToken } from "../features/authSlice";
import { Transactions } from "../comman-types";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { ShoppingBag, Search, X, History } from "lucide-react";
import Pagination from "../components/ui/pagination/pagination.component";
import PageContent from "../layouts/PageContent";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../layouts/ContentComponents";

const OrderHistoryPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, isLoading, isError } =
    useGetTransactionsQuery(access_token);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    const transactions: Transactions = data?.transactions || {};
    return Object.entries(transactions).filter(
      ([key, entry]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.price.toString().includes(searchTerm),
    );
  }, [data?.transactions, searchTerm]);

  const totalPages = useMemo(
    () => Math.ceil(filteredTransactions.length / itemsPerPage),
    [filteredTransactions],
  );

  const currentTransactions = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTransactions, currentPage]);

  if (isLoading) {
    return (
      <PageContent>
        <LoadingState message="Loading your order history..." />
      </PageContent>
    );
  }

  if (isError) {
    return (
      <PageContent>
        <ErrorState message="Error loading transactions. Please try again later." />
      </PageContent>
    );
  }

  const searchInput = (
    <>
      <div className="relative flex-1 md:w-64">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 text-sm border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxVisible={5}
      />
    </>
  );

  return (
    <PageContent
      title="Order History"
      subtitle="View and track all your purchases"
      icon={History}
      headerActions={searchInput}
    >
      {isSuccess && filteredTransactions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {currentTransactions.map(([key, entry]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg mr-3">
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {key}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-500">
                  ${entry.price.toFixed(2)}
                </span>
              </div>
              <div className="p-4">
                <Link to="/order-items" state={{ items: entry }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="No Orders Found"
          description={
            searchTerm
              ? "No transactions match your search criteria."
              : "You haven't made any orders yet."
          }
        />
      )}
    </PageContent>
  );
};

export default OrderHistoryPage;
