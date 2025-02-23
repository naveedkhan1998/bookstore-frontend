import React, { useState, useEffect } from "react";
import {
  useGetUserBooklistsQuery,
  useCreateBooklistMutation,
} from "../services/booklistsServices";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getUserBooklists, setUserBookslist } from "../features/booklistSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteBooklistMutation } from "../services/booklistsServices";
import { Trash2 } from "lucide-react";
import Input from "../components/ui/input/input.component";
import Button from "../components/ui/button/Button";
import Toggle from "../components/ui/toggle/toggle.component";
import Spinner from "../components/ui/spinner/spinner.component";

const BooklistPageAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, refetch } = useGetUserBooklistsQuery(access_token);

  const [deleteBooklist] = useDeleteBooklistMutation();

  if (isSuccess) {
    dispatch(setUserBookslist(data));
  }

  const storeData = useAppSelector(getUserBooklists);

  const [createBooklist, { isSuccess: createBooklistSuccess, isLoading }] =
    useCreateBooklistMutation();

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booklist?")) {
      await deleteBooklist({ id, access_token });
      refetch();
      toast.warning("Booklist Deleted");
    }
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
      toast.success("Booklist Created");
    } else if ("error" in res) {
      toast.error(JSON.stringify(res.error));
    }

    setFormData({
      booklist_name: "",
      isPrivate: false,
    });
  };

  const handleBooklistClick = (id: string) => {
    navigate(`/user-booklist/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-6xl gap-8 p-8 mx-auto mt-10">
      <div className="flex flex-col w-full p-8 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Create New BookList
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Booklist Name"
            type="text"
            name="booklist_name"
            value={formData.booklist_name}
            onChange={handleInputChange}
            required
          />

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Privacy
            </label>
            <Toggle
              checked={formData.isPrivate}
              label="Private"
              onChange={(checked) =>
                setFormData({ ...formData, isPrivate: checked })
              }
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            variant="default"
            className="w-full py-3 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner />
                <span>Creating...</span>
              </div>
            ) : (
              "Create Booklist"
            )}
          </Button>
        </form>
      </div>

      <div className="w-full mt-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Your BookLists
        </h1>

        {storeData && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storeData.bookLists &&
              storeData.bookLists.map((bookList) => (
                <div
                  key={bookList._id}
                  className="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handleBooklistClick(bookList._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {bookList.name}
                        </h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {bookList.isPrivate ? "Private" : "Public"}
                        </span>
                      </div>
                      <Button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleDelete(bookList._id);
                        }}
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
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
