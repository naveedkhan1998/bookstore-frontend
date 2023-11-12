import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetElixirsQuery } from "../services/harryPotterServices";
import { Elixirs } from "../comman-types";

const FetchTest = () => {
  const { data, isSuccess, refetch } = useGetElixirsQuery("a");

  return (
    <div className="container mx-auto p-4">
      {isSuccess && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((elixir: Elixirs) => (
            <div className="bg-white rounded-lg p-4 shadow-md" key={elixir.id}>
              <h3 className="text-lg font-bold mb-2">
                Elixir Name: {elixir.name}
              </h3>
              <p className="text-sm mb-2">
                Characteristics: {elixir.characteristics}
              </p>
              <p className="text-sm">Effects: {elixir.effect}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchTest;
