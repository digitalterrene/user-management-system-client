"use client";
import { useToggleSidebar } from "@/context";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import { Tooltip } from "flowbite-react";

import { basic_routes } from "@/assets/data";
import Link from "next/link";
import useNavigation from "../../../utils/handleNavigate";

export default function Navbar() {
  const pathname = usePathname();
  const { toggleSidebarState } = useToggleSidebar();
  const { user } = useAuthContext();
  const { handleQuickNavigate } = useNavigation();

  return (
    <div className="w-full bgs-[#F0EFE9]   bg-white lg:flex justify-between px-5 lg:px-10 p-3 border-b top-0 sticky h-fit z-50">
      <div className="flex w-full items-center gap-3">
        <Link className="" href={"/"}>
          <img
            src="/branding/logo.png"
            alt="useraccountdashboard-account-logo"
            className="w-36 cursor-pointer"
          />
        </Link>
        <div className="font-bold hidden space-x-2 lg:flex capitalize">
          {basic_routes?.map(({ name, icon }) => (
            <Link
              href={`/${name}`}
              className={`bg-${
                pathname?.includes(`/${name}`) ? "blue-600" : "white"
              } text-${
                pathname?.includes(`/${name}`) ? "white" : ""
              } lg:px-4 cursor-pointer flex items-center justify-center  gap-2 rounded-lg border py-2 text-sm hover:bg-blue-500 hover:text-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all  dark:focus:ring-offset-gray-800`}
            >
              {!toggleSidebarState ? (
                <Tooltip
                  className=" text-black bg-[#F0EFE9]"
                  content={name.replaceAll("-", " ")}
                  placement="right"
                >
                  <span className="text-lg">{icon}</span>
                </Tooltip>
              ) : (
                <span className="text-lg">{icon}</span>
              )}
              {toggleSidebarState && name.replaceAll("-", " ")}
            </Link>
          ))}
        </div>{" "}
        <div className="ml-auto gap-2 flex justify-end">
          {/* <a
            href="/authentication/signout-user"
            className="mr-8 lg:px-4 flex items-center justify-center  gap-2 rounded-lg border py-0.5 text-sm hover:bg-blue-500 hover:text-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all  dark:focus:ring-offset-gray-800"
          >
            <PiSignIn className="lg:text-xl rotate-180" />
            <p className=" hidden  lg:inline-flex">Signout</p>
          </a> */}
          <div className="flex-shrink-0 group block">
            <a
              href="/"
              className="flex   rounded-full p-0.5 border-2 border-blue-100 items-center"
            >
              <img
                className="inline-block flex-shrink-0 h-8 w-8 rounded-full"
                src={
                  user?.image ||
                  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                }
                alt="Image Description"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="font-bold lg:hidden mt-4  flex overflow-x-scroll  w-full capitalize">
        {basic_routes?.map(({ name, icon }) => (
          <a
            key={name} // Always add a key in map
            onClick={() => {
              user?._id &&
                handleQuickNavigate(name, {
                  _id: user?._id,
                  token: user?.token,
                });
            }}
            className={`flex ${
              pathname?.includes(`/${name}`)
                ? "bg-gray-200 rounded-lg text-blue-600"
                : ""
            } cursor-pointer items-center p-2 text-sm font-medium outline-none transition-all duration-100 ease-in-out hover:text-blue-500`}
          >
            {!toggleSidebarState ? (
              <Tooltip
                className="text-black bg-[#F0EFE9]"
                content={name.replaceAll("-", " ")}
                placement="right"
              >
                <span className="text-lg">{icon}</span>
              </Tooltip>
            ) : (
              <span className="mr-2 text-lg">{icon}</span>
            )}
            {toggleSidebarState && name.replaceAll("-", " ")}
          </a>
        ))}
      </div>
    </div>
  );
}
