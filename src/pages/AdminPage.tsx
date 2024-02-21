import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAdminGetUsersQuery } from "../services/adminServices";
import { Link, useLocation } from "react-router-dom";
import { UserType } from "../features/userSlice";
import { Card } from "flowbite-react";
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
    <div className="flex flex-col w-full items-center justify-center p-6 mt-10 ">
      <div className="grid grid-cols-[auto,fr] flex-grow-1 w-[95dvw] sm:w-[80dvw]  shadow-2xl p-6 rounded-2xl m-6 border">
        <h1 className="pt-6 text-2xl font-bold pb-6">Active Users</h1>

        {isSuccess && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] ">
            {activeUsers.map((user: UserType) => (
              <Link
                to="/admin-user-page"
                state={{ user: user, isActive: true }}
              >
                <Card
                  className="max-w-sm bg-main-secondary dark:bg-dark-secondary"
                  imgSrc={`https://ui-avatars.com/api/?name=${user.given_name}+${user.family_name}`}
                >
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                    Name: {user.given_name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Is Admin: {user.isAdmin ? "🟢" : "🔴"}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Is Verified: {user.isVerified ? "🟢" : "🔴"}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-[auto,fr] flex-grow-1 w-[95dvw] sm:w-[80dvw]  shadow-2xl p-6 rounded-2xl border">
        <h1 className="pt-6 text-2xl font-bold pb-6">Deactivated Users</h1>

        {isSuccess && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {inactiveUsers.map((user: UserType) => (
              <Link
                to="/admin-user-page"
                state={{ user: user, isActive: true }}
              >
                <Card
                  className="max-w-sm bg-main-secondary dark:bg-dark-secondary"
                  imgSrc={`https://ui-avatars.com/api/?name=${user.given_name}+${user.family_name}`}
                >
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                    Name: {user.given_name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Is Admin: {user.isAdmin ? "🟢" : "🔴"}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Is Verified: {user.isVerified ? "🟢" : "🔴"}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
