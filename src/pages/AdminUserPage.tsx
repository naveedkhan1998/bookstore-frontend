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
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineUser,
  HiOutlineKey,
  HiArrowLeft,
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

  const StatusBadge = ({
    active,
    label,
  }: {
    active: boolean;
    label: string;
  }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        active
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      <span
        className={`w-2 h-2 mr-2 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`}
      />
      {label}
    </span>
  );

  const InfoCard = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center p-4 bg-white dark:bg-dark-secondary rounded-lg shadow-sm">
      <div className="p-3 mr-4 bg-accent-DEFAULT/10 rounded-full">
        <Icon className="w-6 h-6 text-accent-DEFAULT" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-sm text-gray-600 hover:text-accent-DEFAULT transition-colors"
      >
        <HiArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </button>

      <div className="bg-main-secondary dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-accent-DEFAULT to-primary-DEFAULT">
          <div className="absolute -bottom-16 left-8">
            <img
              src={`https://ui-avatars.com/api/?name=${userObj.given_name}+${userObj.family_name}&size=128&background=random`}
              alt={`${userObj.given_name} ${userObj.family_name}`}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-secondary"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{`${userObj.given_name} ${userObj.family_name}`}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {userObj.email}
              </p>
            </div>
            <div className="space-y-2">
              <StatusBadge
                active={isActive}
                label={isActive ? "Active" : "Deactivated"}
              />
              <StatusBadge
                active={userObj.isVerified ?? false}
                label={userObj.isVerified ? "Verified" : "Unverified"}
              />
              <StatusBadge
                active={userObj.isAdmin ?? false}
                label={userObj.isAdmin ? "Admin" : "User"}
              />
            </div>
          </div>

          <div className="grid gap-4 mb-8 md:grid-cols-2">
            <InfoCard
              icon={HiOutlineUser}
              label="Account Type"
              value={userObj.isAdmin ? "Administrator" : "Standard User"}
            />
            <InfoCard
              icon={HiOutlineMail}
              label="Email"
              value={userObj.email}
            />
            <InfoCard
              icon={HiOutlineKey}
              label="Account Status"
              value={isActive ? "Active" : "Deactivated"}
            />
            <InfoCard
              icon={HiOutlineCalendar}
              label="Verification"
              value={userObj.isVerified ? "Verified" : "Pending"}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              variant={userObj.isAdmin ? "danger" : "default"}
              onClick={handleAdminToggle}
              className="w-full sm:w-auto"
            >
              <HiOutlineShieldCheck className="w-5 h-5 mr-2" />
              {userObj.isAdmin ? "Remove Admin Access" : "Grant Admin Access"}
            </Button>
            <Button
              variant={isActive ? "danger" : "default"}
              onClick={handleDeactivateToggle}
              className="w-full sm:w-auto"
            >
              <HiOutlineBan className="w-5 h-5 mr-2" />
              {isActive ? "Deactivate Account" : "Activate Account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
