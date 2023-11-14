import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import Photo from "../assets/pp.jpg";
import Button from "./Button";

const ProfileMenu = () => {
  const [openModal, setOpenModal] = useState(false);

  const session = {
    user: {
      id: 1,
      image: "google.com", // Added a colon here
      name: "Naveed",
    },
  };

  function signOut() {
    console.log("hello world");
  }

  return (
    <div className="flexCenter z-10 flex-col relative">
      <Menu as="div">
        <Menu.Button
          className="rounded-full w-10 h-10 flex items-center justify-center "
          onMouseEnter={() => setOpenModal(true)}
          onClick={()=>setOpenModal(!openModal)}
        >
          {session?.user?.image && (
            <img
              src={Photo}
              alt="user-profile"
              className="rounded-full w-full h-full"
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
              {session?.user?.image && (
                <img
                  src={Photo}
                  alt="user-profile"
                  className="rounded-full h-32 w-32"
                />
              )}
              <p className="font-semibold">{session?.user?.name}</p>
            </div>

            <div className="flex flex-col gap-3 pt-10 items-start w-full">
              <Menu.Item>
                <Button className="w-full">
                  <Link
                    to={`/profile/${session?.user?.id}`}
                    className="text-sm"
                  >
                    Settings
                  </Link>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="w-full">
                  <Link
                    to={`/profile/${session?.user?.id}`}
                    className="text-sm"
                  >
                    Profile
                  </Link>
                </Button>
              </Menu.Item>
            </div>
            <div className="w-full flexStart border-t border-nav-border mt-5 pt-5">
              <Menu.Item>
                <Button className="text-sm w-full" onClick={() => signOut()}>
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
