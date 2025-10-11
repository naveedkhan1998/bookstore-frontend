import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, BookOpen } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";
import {
  getUserBooklists,
  setUserBookslist,
} from "@/features/booklists/booklistSlice";
import {
  useGetUserBooklistsQuery,
  useCreateBooklistMutation,
  useDeleteBooklistMutation,
} from "@/services/api/booklists";
import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/input.component";
import Toggle from "@/shared/ui/toggle/toggle.component";
import Spinner from "@/shared/ui/spinner/spinner.component";
import PageContent from "@/shared/layouts/PageContent";
import {
  Section,
  Grid,
  ContentCard,
  EmptyState,
} from "@/shared/layouts/ContentComponents";

const BooklistPageAuth: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const access_token = useAppSelector(getCurrentToken);
  const { data, isSuccess, refetch } = useGetUserBooklistsQuery(access_token);
  const [deleteBooklist] = useDeleteBooklistMutation();

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
  }, [createBooklistSuccess, refetch]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserBookslist(data));
    }
  }, [isSuccess, data, dispatch]);

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
    <PageContent
      title="My Booklists"
      subtitle="Create and manage your personal book collections"
      icon={BookOpen}
    >
      <Section
        title="Create New Booklist"
        description="Start a new collection of your favorite books"
      >
        <ContentCard>
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
        </ContentCard>
      </Section>

      <Section
        title="Your Booklists"
        description="Browse and manage your collections"
        className="mt-12"
      >
        {storeData && storeData.bookLists && storeData.bookLists.length > 0 ? (
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
            {storeData.bookLists.map((bookList) => (
              <ContentCard
                key={bookList._id}
                hoverable
                onClick={() => handleBooklistClick(bookList._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {bookList.name}
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mt-2">
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
              </ContentCard>
            ))}
          </Grid>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No Booklists Yet"
            description="Create your first booklist to start organizing your favorite books"
          />
        )}
      </Section>
    </PageContent>
  );
};

export default BooklistPageAuth;
