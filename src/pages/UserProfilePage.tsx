import React from "react";
import { useSelector } from "react-redux";
import { getCurrentUserDetails } from "../features/userSlice";

const UserProfile = () => {
  const user = useSelector(getCurrentUserDetails);

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-[70dvw] h-[70dvh] mx-auto mt-10 p-6 bg-zinc-400 shadow-2xl rounded-2xl">
      <div className="text-center mb-4">
        <img
          src={user.avatarUrl}
          alt="User Avatar"
          className="mx-auto w-24 h-24 rounded-full object-cover"
        />
        <h2 className="text-2xl font-semibold mt-2">
          {`${user.given_name} ${user.family_name}`}
        </h2>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="text-zinc-800">Email: {user.email}</p>
        <p className="text-zinc-800">
          Is Verified: {user.isVerified ? "🟢" : "🔴"}
        </p>
        <p className="text-zinc-800">Is Admin: {user.isAdmin ? "🟢" : "🔴"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
