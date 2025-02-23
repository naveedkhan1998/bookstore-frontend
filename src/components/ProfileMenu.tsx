import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { logOut } from "../features/authSlice";
import { removeToken } from "../services/LocalStorageService";
import Button from "./ui/Button";
import { useAppSelector } from "../app/hooks";
import { getCurrentUserDetails } from "../features/userSlice";
import { unSetUserInfo } from "../features/userSlice";
import { toast } from "react-toastify";
import { unSetUserBooklist } from "../features/booklistSlice";
import { unSetPublicBooklist } from "../features/publicBooklistSlice";

const ProfileMenu = () => {
  const [openModal, setOpenModal] = useState(false);
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
    //console.log("hello world");
  };

  return (
    <div className="relative z-10 flex-col flexCenter">
      <Menu as="div">
        <Menu.Button
          className="flex items-center justify-center w-10 h-10 rounded-full "
          //onMouseEnter={() => setOpenModal(true)}
          onClick={() => setOpenModal(!openModal)}
        >
          {user?.avatarUrl && (
            <img
              src={user?.avatarUrl}
              alt="user-profile"
              className="w-full h-full rounded-full"
            />
          )}
        </Menu.Button>

        <Transition
          show={openModal}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="flexStart profile_menu-items"
            onMouseLeave={() => setOpenModal(false)}
          >
            <div className="flex flex-col items-center gap-y-4">
              {user?.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt="user-profile"
                  className="w-32 h-32 rounded-full"
                />
              )}
              <p className="font-semibold">
                {user?.given_name} {user?.family_name}
              </p>
              <p className="text-sm ">{user?.email}</p>
            </div>

            <div className="flex flex-col items-start w-full gap-3 pt-10">
              <Menu.Item>
                <Button className="w-full bg-main-primary dark:bg-dark-primary ">
                  <Link to={`/setting`} className="text-sm">
                    Settings
                  </Link>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="w-full bg-main-primary dark:bg-dark-primary">
                  <Link to={`/account`} className="text-sm">
                    Profile
                  </Link>
                </Button>
              </Menu.Item>
            </div>
            <div className="w-full pt-5 mt-5 border-t flexStart border-nav-border">
              <Menu.Item>
                <Button
                  className="w-full text-sm bg-main-primary dark:bg-dark-primary"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
