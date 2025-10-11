import { useParams } from "react-router-dom";
import { Beaker } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { getElixirs } from "@/features/elixirs/elixirSlice";
import Modal from "@/shared/components/overlay/Modal";
import PageContent from "@/shared/layouts/PageContent";
import { ContentCard, EmptyState } from "@/shared/layouts/ContentComponents";
import type { Elixirs } from "@/shared/types/api";

const renderValue = (value: any) => {
  if (typeof value === "object" && value !== null) {
    return (
      <ul className="px-4 space-y-1">
        {Object.entries(value).map(
          ([subKey, subValue]) =>
            subKey !== "id" && (
              <li key={subKey} className="text-sm">
                <strong className="text-gray-700 dark:text-gray-300">
                  {subKey}:
                </strong>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {renderValue(subValue)}
                </span>
              </li>
            ),
        )}
      </ul>
    );
  }

  return String(value);
};

const ItemPage = () => {
  const { id } = useParams();
  const elixirs = useAppSelector(getElixirs);

  // Find the selected elixir based on the id parameter
  const selectedElixir = elixirs.find((obj: Elixirs) => obj.id === id);

  return (
    <Modal>
      <PageContent
        title={selectedElixir?.name || "Elixir Details"}
        icon={Beaker}
      >
        {selectedElixir ? (
          <ContentCard>
            <ul className="space-y-3">
              {Object.entries(selectedElixir).map(([key, value]) => (
                <li
                  key={key}
                  className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0"
                >
                  <strong className="text-gray-700 dark:text-gray-300">
                    {key}:
                  </strong>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {renderValue(value)}
                  </span>
                </li>
              ))}
            </ul>
          </ContentCard>
        ) : (
          <EmptyState title="Elixir not found" />
        )}
      </PageContent>
    </Modal>
  );
};

export default ItemPage;
