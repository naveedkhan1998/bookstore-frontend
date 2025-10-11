import { useAppSelector } from "../app/hooks";
import { getCurrentUserDetails } from "../features/userSlice";
import PageContent from "../layouts/PageContent";
import { LoadingState, Grid, ContentCard } from "../layouts/ContentComponents";
import { User } from "lucide-react";
import {
  HiMail,
  HiCheckCircle,
  HiShieldCheck,
  HiBookOpen,
  HiCollection,
  HiUserGroup,
} from "react-icons/hi";

const UserProfile = () => {
  const user = useAppSelector(getCurrentUserDetails);

  if (!user) {
    return (
      <PageContent>
        <LoadingState message="Loading your profile..." />
      </PageContent>
    );
  }

  const stats = [
    { label: "Books Read", value: "124", icon: HiBookOpen },
    { label: "Collections", value: "8", icon: HiCollection },
    { label: "Following", value: "48", icon: HiUserGroup },
  ];

  return (
    <PageContent
      title={`${user.given_name} ${user.family_name}`}
      subtitle="Manage your profile and account settings"
      icon={User}
      noPadding
    >
      <div className="space-y-8">
        <div className="relative">
          {/* Background Header */}
          <div className="h-48 rounded-t-lg bg-gradient-to-r from-indigo-500 to-purple-600" />

          {/* Profile Section */}
          <div className="px-8 pb-8 -mt-24 rounded-lg shadow-lg bg-main-secondary dark:bg-dark-secondary">
            <div className="flex flex-col items-center">
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-32 h-32 transition-transform transform -translate-y-16 border-4 border-white rounded-full shadow-xl dark:border-gray-800 hover:scale-105"
              />
              <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {`${user.given_name} ${user.family_name}`}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Book Enthusiast</p>
            </div>

            {/* Stats Grid */}
            <Grid cols={{ default: 3 }} gap={6} className="mt-8">
              {stats.map((stat) => (
                <ContentCard
                  key={stat.label}
                  className="text-center transition-shadow hover:shadow-md"
                >
                  <stat.icon className="w-8 h-8 mx-auto text-indigo-500 dark:text-indigo-400" />
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </ContentCard>
              ))}
            </Grid>

            {/* Info Cards */}
            <Grid cols={{ default: 1, md: 2 }} gap={6} className="mt-8">
              <ContentCard hoverable>
                <h3 className="mb-4 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-800 dark:text-gray-300">
                    <HiMail className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                    <p>{user.email}</p>
                  </div>
                  <div className="flex items-center text-gray-800 dark:text-gray-300">
                    <HiCheckCircle className="w-5 h-5 mr-3 text-green-500" />
                    <p>
                      Account Status:{" "}
                      {user.isVerified ? "Verified" : "Unverified"}
                    </p>
                  </div>
                </div>
              </ContentCard>

              <ContentCard hoverable>
                <h3 className="mb-4 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-800 dark:text-gray-300">
                    <HiShieldCheck className="w-5 h-5 mr-3 text-blue-500" />
                    <p>Role: {user.isAdmin ? "Administrator" : "Member"}</p>
                  </div>
                  <div className="flex items-center text-gray-800 dark:text-gray-300">
                    <HiUserGroup className="w-5 h-5 mr-3 text-purple-500" />
                    <p>Member since: {new Date().getFullYear()}</p>
                  </div>
                </div>
              </ContentCard>
            </Grid>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default UserProfile;
