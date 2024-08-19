import React, { useState, useEffect } from "react";
import { useGetUserBooklistsQuery, useCreateBooklistMutation } from "../services/booklistsServices";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import Button from "../components/Button";
import { getUserBooklists, setUserBookslist } from "../features/booklistSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteBooklistMutation } from "../services/booklistsServices";
import { Card, FloatingLabel, ToggleSwitch, Spinner } from "flowbite-react";
import { Trash2 } from "lucide-react";

const BooklistPageAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, refetch } = useGetUserBooklistsQuery(access_token);

  const [deleteBooklist, { isSuccess: booklistDeleted }] = useDeleteBooklistMutation();

  if (isSuccess) {
    dispatch(setUserBookslist(data));
  }

  const storeData = useAppSelector(getUserBooklists);

  const [createBooklist, { isSuccess: createBooklistSuccess, isLoading }] = useCreateBooklistMutation();

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

  const handleBooklistClick = (id: String) => {
    navigate(`/user-booklist/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-6xl gap-8 p-8 mx-auto mt-10">
      <div className="flex flex-col w-full p-8 shadow-lg bg-main-secondary rounded-xl dark:bg-dark-secondary">
        <h1 className="mb-6 text-2xl font-bold ">Create New BookList</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabel variant="standard" label="Booklist Name" type="text" name="booklist_name" value={formData.booklist_name} onChange={handleInputChange} required />

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Privacy</label>
            <ToggleSwitch checked={formData.isPrivate} label="Private" onChange={(checked) => setFormData({ ...formData, isPrivate: checked })} />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Booklist"
            )}
          </Button>
        </form>
      </div>
      <div className="w-full mt-8">
        <h1 className="mb-6 text-2xl font-bold ">Your BookLists</h1>

        {storeData && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storeData.bookLists &&
              storeData.bookLists.map((bookList) => (
                <Card key={bookList._id} onClick={() => handleBooklistClick(bookList._id)} className="p-4 rounded-lg shadow bg-main-secondary dark:bg-dark-secondary">
                  <div className="flex items-center justify-between">
                    <div id={bookList._id}  className="cursor-pointer">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{bookList.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{bookList.isPrivate ? "Private" : "Public"}</p>
                    </div>
                    <Button onClick={() => handleDelete(bookList._id)} variant="default" size="icon" className="p-2 text-white bg-red-600 rounded-full hover:bg-red-400">
                      <Trash2 />
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooklistPageAuth;
