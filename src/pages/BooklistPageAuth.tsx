import React, { useState, useEffect } from "react";
import {
  useGetUserBooklistsQuery,
  useCreateBooklistMutation,
} from "../services/booklistsServices";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import Button from "../components/Button";
import { getUserBooklists, setUserBookslist } from "../features/booklistSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteBooklistMutation } from "../services/booklistsServices";

const BooklistPageAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, refetch } = useGetUserBooklistsQuery(access_token);

  const [
    deleteBooklist,
    { isSuccess: booklistDeleted },
  ] = useDeleteBooklistMutation();

  if (isSuccess) {
    dispatch(setUserBookslist(data));
  }

  const storeData = useAppSelector(getUserBooklists);

  const [
    createBooklist,
    { isSuccess: createBooklistSuccess },
  ] = useCreateBooklistMutation();

  const [formData, setFormData] = useState({
    booklist_name: "",
    isPrivate: false,
  });

  useEffect(() => {
    if (createBooklistSuccess) {
      refetch();
      toast.success("Booklist Created");
    }
  }, [createBooklistSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleDelete = async (id: String) => {
    alert("Are you sure you want to delete this booklist?");
    await deleteBooklist({ id, access_token });
    refetch();
    toast.warning("Booklist Deleted");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const booklist = {
      booklist_name: formData.booklist_name,
      isPrivate: formData.isPrivate,
    };

    const res = await createBooklist({
      access_token,
      booklist,
    });
    if ("data" in res) {
    } else if ("error" in res) {
      toast.error(JSON.stringify(res.error));
    }

    setFormData({
      booklist_name: "",
      isPrivate: false,
    });
  };

  /// handle booklist click

  function handleBooklistClick(id: String) {
    navigate(`/user-booklist/${id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 mt-6 w-full">
      <div className="flex flex-col w-[80dvw] shadow-2xl p-6 rounded-2xl">
        <h1 className="pt-6 text-lg">Create New BookList</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Booklist Name
          </label>
          <input
            type="text"
            name="booklist_name"
            value={formData.booklist_name}
            onChange={handleInputChange}
            className="rounded-lg border border-secondary-border shadow-inner shadow-secondary py-2 px-4 text-lg w-full focus:border-blue-500 outline-none"
            required
          />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Privacy
            </label>
            <div className="flex items-center">
              <label>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Private
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Create Booklist
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-[auto,fr] flex-grow-1  w-[80dvw]  shadow-2xl p-6 rounded-2xl">
        <h1 className="pt-6 text-2xl font-bold">Your BookLists</h1>

        {storeData && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {storeData.bookLists &&
              storeData.bookLists.map((bookList) => (
                <div className="flex flex-row" key={bookList._id}>
                  <div
                    id={bookList._id}
                    onClick={() => handleBooklistClick(bookList._id)}
                    className="flex flex-col p-6 rounded-lg shadow-lg bg-zinc-400 hover:bg-zinc-500 w-full "
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      Name: {bookList.name}
                    </h2>
                    <p className="text-gray-600">
                      Type: {bookList.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                  <div className="relative -left-10">
                    <Button
                      onClick={() => handleDelete(bookList._id)}
                      variant={"ghost"}
                      size={"icon"}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooklistPageAuth;
