import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAdminGetUsersQuery } from "../services/adminServices";
import { Link, useLocation } from "react-router-dom";
import { UserType } from "../features/userSlice";
import { getRefresh, setRefresh } from "../features/refreshSlice";

const AdminPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const access_token = useAppSelector(getCurrentToken);

  const refresh = useAppSelector(getRefresh);

  const { data, isSuccess, refetch } = useAdminGetUsersQuery(access_token);

  let activeUsers: UserType[] = [];
  let inactiveUsers: UserType[] = [];

  if (isSuccess) {
    activeUsers = data.activeUsers;
    inactiveUsers = data.inactiveUsers;
  }

  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
      refetch();
    }
  }, [refresh]);

  return (
    <div className="flex flex-col w-full items-center justify-center p-6 mt-10">
      <div className="grid grid-cols-[auto,fr] flex-grow-1  w-[80dvw]  shadow-2xl p-6 rounded-2xl m-6">
        <h1 className="pt-6 text-2xl font-bold pb-6">Active Users</h1>

        {isSuccess && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {activeUsers.map((user: UserType) => (
              <div className="flex flex-row" key={user.family_name}>
                <Link
                  to="/admin-user-page"
                  state={{ user: user, isActive: true }}
                >
                  <div
                    id={user._id}
                    // onClick={() => handleBooklistClick(bookList)}
                    className="flex flex-col p-6 rounded-lg shadow-lg bg-zinc-400 hover:bg-zinc-500 w-full "
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      Name: {user.given_name}
                    </h2>

                    <h2 className="text-small font-semibold mb-2">
                      Is Admin: {user.isAdmin ? "🟢" : "🔴"}
                    </h2>
                    <h2 className="text-small font-semibold mb-2">
                      Is Verified:{" "}
                      {user.isVerified ? "🟢" : "🔴"}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-[auto,fr] flex-grow-1  w-[80dvw]  shadow-2xl p-6 rounded-2xl">
        <h1 className="pt-6 text-2xl font-bold pb-6">Deactivated Users</h1>

        {isSuccess && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {inactiveUsers.map((user: UserType) => (
              <div className="flex flex-row" key={user.family_name}>
                <Link
                  to="/admin-user-page"
                  state={{ user: user, isActive: false }}
                >
                  <div
                    id={user._id}
                    // onClick={() => handleBooklistClick(bookList)}
                    className="flex flex-col p-6 rounded-lg shadow-lg bg-zinc-400 hover:bg-zinc-500 w-full "
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      Name: {user.given_name}
                    </h2>

                    <h2 className="text-small font-semibold mb-2">
                      Is Admin: {user.isAdmin ? "🟢" : "🔴"}
                    </h2>
                    <h2 className="text-small font-semibold mb-2">
                      Is Verified:{" "}
                      {user.isVerified ? "🟢" : "🔴"}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
