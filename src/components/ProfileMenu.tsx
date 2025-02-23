import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../features/authSlice";
import { removeToken } from "../services/LocalStorageService";
import { useAppSelector } from "../app/hooks";
import { getCurrentUserDetails } from "../features/userSlice";
import { unSetUserInfo } from "../features/userSlice";
import { toast } from "react-toastify";
import { unSetUserBooklist } from "../features/booklistSlice";
import { unSetPublicBooklist } from "../features/publicBooklistSlice";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(getCurrentUserDetails);
  const dispatch = useDispatch();

  const signOut = () => {
    removeToken();
    dispatch(unSetUserInfo());
    dispatch(logOut());
    dispatch(unSetUserBooklist());
    dispatch(unSetPublicBooklist());
    window.location.reload();
    toast.success("Logged Out");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 overflow-hidden transition-all transform rounded-full ring-2 ring-offset-2 ring-indigo-500 dark:ring-indigo-400 hover:ring-opacity-75 hover:scale-105"
      >
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt="profile"
            className="object-cover w-full h-full"
          />
        )}
      </button>

      <div
        className={`absolute right-0 w-72 mt-3 transform transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="relative p-6 bg-gradient-to-b from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt="profile"
                className="w-20 h-20 mx-auto rounded-full ring-4 ring-white dark:ring-gray-800"
              />
            )}
            <p className="mt-4 text-lg font-medium text-center text-white">
              {user?.given_name} {user?.family_name}
            </p>
            <p className="text-sm text-center text-indigo-100">{user?.email}</p>
          </div>

          <div className="p-4 space-y-1 border-t border-gray-200 dark:border-gray-700">
            <MenuLink to="/setting" icon="⚙️" label="Settings" />
            <MenuLink to="/account" icon="👤" label="Profile" />
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 group"
            >
              <span className="mr-3">🚪</span>
              <span className="font-medium group-hover:text-red-700 dark:group-hover:text-red-400">
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) => (
  <Link
    to={to}
    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 transition-colors rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
      {label}
    </span>
  </Link>
);

export default ProfileMenu;
