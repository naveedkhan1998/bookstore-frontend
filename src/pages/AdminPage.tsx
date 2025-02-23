import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAdminGetUsersQuery } from "../services/adminServices";
import { Link } from "react-router-dom";
import { UserType } from "../features/userSlice";
import { getRefresh, setRefresh } from "../features/refreshSlice";
import {
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineChartBar,
} from "react-icons/hi";

const AdminPage = () => {
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const refresh = useAppSelector(getRefresh);
  const { data, isLoading, refetch } = useAdminGetUsersQuery(access_token);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
      refetch();
    }
  }, [refresh, dispatch, refetch]);

  const filterUsers = (users: UserType[] = []) => {
    return users.filter(
      (user) =>
        user.given_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full space-x-2">
        <div className="w-4 h-4 bg-accent-DEFAULT rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-accent-DEFAULT rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-accent-DEFAULT rounded-full animate-bounce"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="p-6 bg-white dark:bg-dark-secondary rounded-xl shadow-lg">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container p-4 mx-auto space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="relative">
          <HiOutlineSearch className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-DEFAULT focus:border-transparent dark:bg-dark-secondary"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data?.activeUsers.length + data?.inactiveUsers.length}
          icon={HiOutlineUserGroup}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Users"
          value={data?.activeUsers.length}
          icon={HiOutlineUserAdd}
          color="bg-green-500"
        />
        <StatCard
          title="Inactive Users"
          value={data?.inactiveUsers.length}
          icon={HiOutlineUserRemove}
          color="bg-red-500"
        />
        <StatCard
          title="Admin Users"
          value={data?.activeUsers.filter((u: UserType) => u.isAdmin).length}
          icon={HiOutlineChartBar}
          color="bg-purple-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
            activeTab === "active"
              ? "border-b-2 border-accent-DEFAULT text-accent-DEFAULT"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Users
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
            activeTab === "inactive"
              ? "border-b-2 border-accent-DEFAULT text-accent-DEFAULT"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("inactive")}
        >
          Deactivated Users
        </button>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden">
        <div className="grid gap-4 p-4">
          {filterUsers(
            activeTab === "active" ? data?.activeUsers : data?.inactiveUsers,
          ).map((user: UserType) => (
            <Link
              key={user._id}
              to="/admin-user-page"
              state={{ user, isActive: activeTab === "active" }}
              className="p-4 transition-all duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.given_name}+${user.family_name}&background=random`}
                  alt={`${user.given_name} ${user.family_name}`}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.given_name} {user.family_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {user.isAdmin && (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Admin
                    </span>
                  )}
                  {user.isVerified ? (
                    <HiOutlineShieldCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiOutlineBan className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
