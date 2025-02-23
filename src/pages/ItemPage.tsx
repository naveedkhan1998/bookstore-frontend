import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import { getElixirs } from "../features/elixirSlice";
import { useAppSelector } from "../app/hooks";
import { Elixirs } from "../comman-types";

const renderValue = (value: any) => {
  if (typeof value === "object" && value !== null) {
    return (
      <ul className="px-4">
        {Object.entries(value).map(
          ([subKey, subValue]) =>
            subKey !== "id" && (
              <li key={subKey}>
                <strong>{subKey}:</strong> {renderValue(subValue)}
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
      {selectedElixir && (
        <div>
          <ul>
            {Object.entries(selectedElixir).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {renderValue(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default ItemPage;
