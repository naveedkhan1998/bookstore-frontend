import type { FC } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShieldCheck, HiOutlineBan } from "react-icons/hi";
import type { UserType } from "@/features/user/userSlice";
import { ContentCard, Section } from "@/shared/layouts/ContentComponents";

interface UserListProps {
  users: UserType[];
  isActive: boolean;
}

const UserList: FC<UserListProps> = ({ users, isActive }) => (
  <Section>
    <ContentCard>
      <div className="grid gap-4">
        {users.map((user: UserType) => (
          <Link
            key={user._id}
            to="/admin-user-page"
            state={{ user, isActive }}
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
    </ContentCard>
  </Section>
);

export default UserList;
