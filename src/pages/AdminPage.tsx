import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAdminGetUsersQuery } from "../services/adminServices";
import { Link } from "react-router-dom";
import { UserType } from "../features/userSlice";
import { getRefresh, setRefresh } from "../features/refreshSlice";
import { HiOutlineShieldCheck, HiOutlineBan } from "react-icons/hi";

const AdminPage = () => {
  const dispatch = useAppDispatch();

  const access_token = useAppSelector(getCurrentToken);
  const refresh = useAppSelector(getRefresh);
  const { data, isSuccess, refetch } = useAdminGetUsersQuery(access_token);

  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
      refetch();
    }
  }, [refresh]);

  if (!isSuccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">Loading users...</p>
      </div>
    );
  }

  const UserListItem = ({ user, isActive }: { user: UserType; isActive: boolean }) => (
    <Link to="/admin-user-page" state={{ user: user, isActive }} className="block p-4 transition-colors duration-200 rounded-lg hover:bg-main-primary/50 dark:hover:bg-dark-primary/50">
      <div className="flex items-center">
        <img src={`https://ui-avatars.com/api/?name=${user.given_name}+${user.family_name}`} alt={`${user.given_name} ${user.family_name}`} className="w-10 h-10 mr-4 rounded-full" />
        <div className="flex-grow">
          <h5 className="font-medium text-gray-900 text-md dark:text-gray-200">{`${user.given_name} ${user.family_name}`}</h5>
          <div className="flex text-sm text-gray-700 dark:text-gray-400">
            <span className="flex items-center mr-4">
              <HiOutlineShieldCheck className={`mr-1 ${user.isAdmin ? "text-green-500" : "text-gray-400"}`} />
              Admin: {user.isAdmin ? "Yes" : "No"}
            </span>
            <span className="flex items-center">
              <HiOutlineBan className={`mr-1 ${user.isVerified ? "text-green-500" : "text-red-500"}`} />
              Verified: {user.isVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container p-8 mx-auto mt-10">
      <h1 className="mb-8 text-3xl font-bold text-center ">User Management</h1>

      <div className="flex space-x-4">
        <section className="flex-1 overflow-auto p-4 rounded-lg shadow-md bg-main-secondary dark:bg-dark-secondary max-h-[80vh]">
          <h2 className="sticky top-0 p-2 mb-4 text-2xl font-semibold rounded bg-main-primary dark:bg-dark-primary">Active Users</h2>
          {data.activeUsers.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-400">No active users found.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.activeUsers.map((user: UserType) => (
                <li key={user._id}>
                  <UserListItem user={user} isActive={true} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex-1 overflow-auto p-4 rounded-lg shadow-md bg-main-secondary dark:bg-dark-secondary max-h-[80vh]">
          <h2 className="sticky top-0 p-2 mb-4 text-2xl font-semibold rounded bg-main-primary dark:bg-dark-primary">Deactivated Users</h2>
          {data.inactiveUsers.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-400">No deactivated users found.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.inactiveUsers.map((user: UserType) => (
                <li key={user._id}>
                  <UserListItem user={user} isActive={false} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
