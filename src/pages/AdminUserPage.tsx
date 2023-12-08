import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserType } from "../features/userSlice";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import {
  useAdminDisableUserMutation,
  useAdminHideReviewMutation,
  useAdminMakeAdminMutation,
} from "../services/adminServices";
import { useDispatch } from "react-redux";
import { setRefresh } from "../features/refreshSlice";

const AdminUserPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = location.state;
  const { isAdmin } = location.state;

  const [
    adminDisableUser,
    { isSuccess: UserDisabled },
  ] = useAdminDisableUserMutation();
  const [
    adminMakeAdmin,
    { isSuccess: AdminMade },
  ] = useAdminMakeAdminMutation();

  const userObj: UserType = user;

  const handleAdmin = async (id: String) => {
    await adminMakeAdmin({ user_id: id, access_token });
  };
  const handleDeactivate = async (id: String) => {
    await adminDisableUser({ user_id: id, access_token });
  };

  useEffect(() => {
    if (AdminMade) {
      toast.success("Status Changed");
      window.history.back();
    }
    if (UserDisabled) {
      toast.success("Status Changed");
      window.history.back();
    }
    dispatch(setRefresh(true));
  }, [AdminMade, UserDisabled]);

  return (
    <div className="flex flex-col items-center w-[70dvw] h-[70dvh] mx-auto mt-10 p-6 bg-zinc-400 shadow-2xl rounded-2xl">
  <div className="flex flex-col justify-center items-center w-full h-full">
    <div className="text-center mb-4">
      <h2 className="text-3xl font-bold text-zinc-900">
        User Name: {`${userObj.given_name} ${userObj.family_name}`}
      </h2>
    </div>

    <img
      src={`https://ui-avatars.com/api/?name=${userObj.given_name}+${userObj.family_name}`}
      alt="profile"
      className="mx-auto w-24 h-24 rounded-full object-cover"
    />

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-zinc-800">
        Contact Information
      </h3>
      <p className="text-zinc-700">Email: {userObj.email}</p>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-zinc-800">
        User Status
      </h3>
      <p className="text-zinc-700">
        Is Verified: {userObj.isVerified ? "🟢" : "🔴"}
      </p>
      <p className="text-zinc-700">
        Is Admin: {userObj.isAdmin ? "🟢" : "🔴"}
      </p>
      <p className="text-zinc-700">
        Is Deactivated: {isAdmin ? "🟢" : "🔴"}
      </p>
    </div>
  </div>

  <div className="flex flex-row justify-between m-6 items-center w-full">
    <Button
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
      onClick={() => handleAdmin(userObj._id)}
    >
      Make/Remove Admin
    </Button>

    <Button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
      onClick={() => handleDeactivate(userObj._id)}
    >
      Deactivate/Activate User
    </Button>
  </div>
</div>

  );
};

export default AdminUserPage;
