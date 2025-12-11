import { useState, useEffect, useMemo, type FC } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineChartBar,
} from "react-icons/hi";
import { ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";
import { getRefresh, setRefresh } from "@/features/session/refreshSlice";
import type { UserType } from "@/features/user/userSlice";
import { useAdminGetUsersQuery } from "@/services/api/admin";
import PageContent from "@/shared/layouts/PageContent";
import { LoadingState, Grid, Section } from "@/shared/layouts/ContentComponents";
import {
  StatCard,
  UserTabs,
  UserList,
  SearchInput,
} from "@/features/admin/components";

const AdminPage: FC = () => {
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
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers = useMemo(() => {
    const users =
      activeTab === "active" ? data?.activeUsers : data?.inactiveUsers;
    return filterUsers(users);
  }, [data, activeTab, searchTerm]);

  const stats = useMemo(
    () => [
      {
        title: "Total Users",
        value: (data?.activeUsers?.length ?? 0) + (data?.inactiveUsers?.length ?? 0),
        icon: HiOutlineUserGroup,
        color: "bg-blue-500",
      },
      {
        title: "Active Users",
        value: data?.activeUsers?.length ?? 0,
        icon: HiOutlineUserAdd,
        color: "bg-green-500",
      },
      {
        title: "Inactive Users",
        value: data?.inactiveUsers?.length ?? 0,
        icon: HiOutlineUserRemove,
        color: "bg-red-500",
      },
      {
        title: "Admin Users",
        value: data?.activeUsers?.filter((u: UserType) => u.isAdmin).length ?? 0,
        icon: HiOutlineChartBar,
        color: "bg-purple-500",
      },
    ],
    [data]
  );

  if (isLoading) {
    return (
      <PageContent>
        <LoadingState message="Loading user data..." />
      </PageContent>
    );
  }

  return (
    <PageContent
      title="User Management"
      subtitle="Manage users, permissions, and account settings"
      icon={ShieldCheck}
      headerActions={
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users..."
        />
      }
    >
      <Section>
        <Grid cols={{ default: 1, sm: 2, lg: 4 }} gap={4}>
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </Grid>
      </Section>

      <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <UserList users={filteredUsers} isActive={activeTab === "active"} />
    </PageContent>
  );
};

export default AdminPage;
