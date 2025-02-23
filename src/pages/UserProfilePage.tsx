import React from "react";
import { useSelector } from "react-redux";
import { getCurrentUserDetails } from "../features/userSlice";
import { Spinner } from "flowbite-react";
import {
  HiMail,
  HiCheckCircle,
  HiXCircle,
  HiShieldCheck,
} from "react-icons/hi";

const UserProfile = () => {
  const user = useSelector(getCurrentUserDetails);

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="container items-start justify-start p-6 mx-auto mt-10 rounded-lg shadow-lg max-h-md bg-main-secondary dark:bg-dark-secondary">
      <div className="mb-6 text-center">
        <img
          src={user.avatarUrl}
          alt="User Avatar"
          className="object-cover mx-auto border-4 border-indigo-500 rounded-full shadow-md w-28 h-28 dark:border-indigo-300"
        />
        <h2 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-gray-200">{`${user.given_name} ${user.family_name}`}</h2>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-white/20 dark:bg-dark-secondary-light">
        <h3 className="mb-4 text-xl font-semibold text-indigo-700 dark:text-indigo-300">
          Contact Information
        </h3>
        <div className="flex items-center mb-2 text-gray-800 dark:text-gray-300">
          <HiMail className="mr-2" />
          <p>Email: {user.email}</p>
        </div>
        <div className="flex items-center mb-2 text-gray-800 dark:text-gray-300">
          <HiCheckCircle className="mr-2 text-green-500 dark:text-green-400" />
          <p>
            Is Verified:{" "}
            {user.isVerified ? (
              "Verified"
            ) : (
              <HiXCircle className="ml-2 text-red-500 dark:text-red-400" />
            )}
          </p>
        </div>
        <div className="flex items-center text-gray-800 dark:text-gray-300">
          <HiShieldCheck className="mr-2 text-yellow-500 dark:text-yellow-400" />
          <p>Is Admin: {user.isAdmin ? "Admin" : "User"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
