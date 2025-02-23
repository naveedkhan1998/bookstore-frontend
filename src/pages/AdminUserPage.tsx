import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserType } from "../features/userSlice";
import Button from "../components/ui/button/Button";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import {
  useAdminDisableUserMutation,
  useAdminMakeAdminMutation,
} from "../services/adminServices";
import { setRefresh } from "../features/refreshSlice";
import {
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineBan,
} from "react-icons/hi";

const AdminUserPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isActive } = location.state;
  const userObj: UserType = user;

  const [adminDisableUser, { isSuccess: userDisabled }] =
    useAdminDisableUserMutation();
  const [adminMakeAdmin, { isSuccess: adminMade }] =
    useAdminMakeAdminMutation();

  const handleAdminToggle = async () => {
    await adminMakeAdmin({ user_id: userObj._id, access_token });
  };

  const handleDeactivateToggle = async () => {
    await adminDisableUser({ user_id: userObj._id, access_token });
  };

  useEffect(() => {
    if (adminMade || userDisabled) {
      toast.success("Status Changed");
      dispatch(setRefresh(true));
      navigate(-1);
    }
  }, [adminMade, userDisabled, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center w-full p-8 mx-auto mt-10 shadow-xl max-w-7xl bg-main-secondary dark:bg-dark-secondary rounded-2xl">
      <div className="mb-6 text-center">
        <img
          src={`https://ui-avatars.com/api/?name=${userObj.given_name}+${userObj.family_name}`}
          alt={`${userObj.given_name} ${userObj.family_name}`}
          className="object-cover mb-4 rounded-full size-48"
        />
        <h2 className="text-3xl font-bold ">{`${userObj.given_name} ${userObj.family_name}`}</h2>
      </div>

      <div className="w-full mb-6 text-center">
        <h3 className="mb-2 text-lg font-semibold ">Contact Information</h3>
        <p className="flex items-center justify-center ">
          <HiOutlineMail className="mr-2" />
          {userObj.email}
        </p>
      </div>

      <div className="w-full mb-8 text-center">
        <h3 className="mb-2 text-lg font-semibold ">User Status</h3>
        <p className="flex items-center justify-center ">
          <HiOutlineShieldCheck
            className={`mr-2 ${userObj.isAdmin ? "text-green-500" : "text-gray-400"}`}
          />
          Admin: {userObj.isAdmin ? "Yes" : "No"}
        </p>
        <p className="flex items-center justify-center mt-1 ">
          <HiOutlineBan
            className={`mr-2 ${userObj.isVerified ? "text-green-500" : "text-red-500"}`}
          />
          Verified: {userObj.isVerified ? "Yes" : "No"}
        </p>
        <p className="flex items-center justify-center mt-1 ">
          <HiOutlineBan
            className={`mr-2 ${isActive ? "text-green-500" : "text-red-500"}`}
          />
          Deactivated: {isActive ? "No" : "Yes"}
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          className="px-6 py-3 transition duration-300 bg-green-600 rounded-lg hover:bg-green-500"
          onClick={handleAdminToggle}
        >
          {userObj.isAdmin ? "Remove Admin" : "Make Admin"}
        </Button>
        <Button
          className="px-6 py-3 transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-500"
          onClick={handleDeactivateToggle}
        >
          {isActive ? "Deactivate User" : "Activate User"}
        </Button>
      </div>
    </div>
  );
};

export default AdminUserPage;
