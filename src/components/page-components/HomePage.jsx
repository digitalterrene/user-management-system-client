"use client";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { accountServerUrl } from "../../../utils/urls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { renderFieldValue } from "../../../utils/renderFieldValue";
import { FaRegEdit } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { AiOutlineSave } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Signup from "../auth-components/Signup";
import Signin from "../auth-components/Signin";
import("flowbite");
export default function HomePage() {
  const [user, setUser] = useState(null);
  let local_user;

  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(user);
  const [editBlock, setEditBlock] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { picture, ...otherUserInfo } = user || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${accountServerUrl}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const userData = await response.json();
        setUser(userData);
        console.log({ userData });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      }
    };

    fetchUser();
  }, [loading]);

  const updateImages = async (key_to_update, value_to_update) => {
    let level_extention = "update-set-single-data-strings";
    let ressolved_value_to_update = value_to_update;

    if (key_to_update === "image" || key_to_update === "banner") {
      if (value_to_update === undefined) {
        return { error: "Please select at least one image" };
      }

      if (
        value_to_update.type === "image/jpeg" ||
        value_to_update.type === "image/png"
      ) {
        try {
          const data = new FormData();
          data.append("file", value_to_update);
          data.append(
            "upload_preset",
            `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
          );
          data.append(
            "cloud_name",
            `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "post",
              body: data,
            }
          );

          const imageData = await response.json();
          ressolved_value_to_update = `${imageData.secure_url.toString()}`;
          //alert(`${imageData.secure_url.toString()}`);
        } catch (err) {
          return { error: `${err} ` };
        }
      } else {
        return { error: "Please select at least one image" };
      }
    }

    try {
      const res = await fetch(
        `${accountServerUrl}/${level_extention}/_id/${user?._id}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${local_user?.token}`,
            useraccountdashboard_account_user_id: `${local_user?._id}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          cache: "no-cache",
          body: JSON.stringify({
            key_to_update: key_to_update,
            value_to_update: ressolved_value_to_update,
          }),
        }
      );

      const json = await res.json();

      if (res.ok) {
        toast.success(`${key_to_update} updated successfully !`, {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          location.reload();
        }, 5000);
      } else {
        toast.error(`${json.error} `, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      // Handle errors from the fetch request to the backend
      console.error(error);
      return { error: "An error occurred while updating data" };
    }
  };

  useEffect(() => {
    import("preline");
  }, []);
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = toast.loading("Updating user information...");

    try {
      const response = await fetch(`${accountServerUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(inputs),
      });

      const json = await response.json();

      if (response.ok) {
        toast.update(id, {
          render: `${json.message}`,
          type: "success",
          isLoading: false,
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
      } else {
        toast.update(id, {
          render: `${json.error}`,
          type: "error",
          isLoading: false,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error updating logged in  user:", error);

      toast.update(id, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      // Dismiss the toast after 5 seconds
      setTimeout(() => {
        toast.dismiss();
      }, 5000);
    }
  };

  return (
    <>
      {!user ? (
        <Signup />
      ) : (
        <div className="flex items-start bg-gray-100 p-10 py-2 justify-between w-full">
          <div className="w-2/3 bg-white">
            <ToastContainer />
            <div className="  w-full ">
              <div
                style={{
                  backgroundImage: `url(${
                    user?.banner ||
                    "https://img.freepik.com/free-photo/texture-white-wooden-boards_1232-342.jpg?size=626&ext=jpg&ga=GA1.1.1135384207.1703006759&semt=ais"
                  })`,
                }}
                className="group  w-full bg-center bg-no-repeat rounded-lg flex justify-end  p-3 bg-cover h-64"
              >
                <form className="mt-2">
                  <label className="block relative">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateImages("banner", e.target.files[0])
                      }
                      className="absolute inset-0 opacity-0"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      className="py-2 ml-auto h-fit  bg-white   hidden group-hover:inline-flex w-fit px-4  items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      <FiEdit3 className="text-xl" /> Banner
                    </button>
                  </label>
                </form>
              </div>
              <div className=" -mt-12 bg-black/60 w-fit space-x-2 p-4 py-1 rounded-xl h-fit  justify-center items-center flex ml-6    ">
                <div
                  className=" bg-center bg-cover bg-[#131921] bg-no-repeat group-avatar border   w-14 h-14 rounded-xl"
                  style={{
                    backgroundImage: user?.image
                      ? `url(${user?.image})`
                      : `url("https://cdn-icons-png.flaticon.com/128/3177/3177440.png")`,
                  }}
                ></div>

                <div className="  text-white p-3 text-lg h-fit capitalize font-medium  ">
                  {user?.firstName || "firstname"}
                  <p className="text-sm">{user?.lastName || "lastname"}</p>
                </div>
              </div>
              {/* here */}
            </div>
            <div className="p-10  lg:px-6 px-0 lg:flex gap-10 w-full justify-between">
              <div className="w-full lg:w-1/2   space-y-6">
                <div className="bg-white h-fit overflow-hidden shadow rounded-lg border">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Profile Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {user?.description || "description"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      {Object.entries(user || {})
                        .filter(([field, value]) => {
                          // Debug to check if filtering is working
                          console.log("Field:", field, "Value:", value);
                          return field !== "token"; // Exclude 'token'
                        })
                        .map(([field, value]) => (
                          <div>
                            {field !== "image" && field !== "banner" && (
                              <div
                                key={field}
                                className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                              >
                                <dt className="text-sm font-medium text-gray-500">
                                  {field?.replaceAll("_", " ")}
                                </dt>
                                <dd className="mt-1 text-sm text-ellipsis w-full truncate text-gray-900 sm:mt-0 sm:col-span-2">
                                  {renderFieldValue(field, value)}
                                </dd>
                              </div>
                            )}
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                {/* Edit user component starts here */}
                <form
                  onSubmit={handleUpdateInfo}
                  className="  space-y-6 lg:space-y-0 gap-6  "
                >
                  <div className="bg-white  overflow-hidden shadow rounded-lg border">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Edit Profile Information
                        </h3>
                        {editBlock ? (
                          <div className="flex gap-4 items-center">
                            <button
                              type="button"
                              onClick={() => setEditBlock(false)}
                              className="flex text-xs flex-shrink-0 justify-center items-center gap-2 p-1  font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            >
                              <TiCancel className="text-xl text-white" />
                              Cancel
                            </button>{" "}
                            <button
                              type="submit"
                              onClick={handleUpdateInfo}
                              className="flex text-xs flex-shrink-0 justify-center items-center gap-2 p-1  font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            >
                              <AiOutlineSave className="text-xl" />
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditBlock(true);
                            }}
                            className="flex flex-shrink-0 justify-center items-center gap-2 p-1.5 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            <FaRegEdit />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Please keep your information updated to stay relevant
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        {Object.entries(user || {})
                          .filter(([field, value]) => {
                            // Debug to check if filtering is working
                            console.log("Field:", field, "Value:", value);
                            return field !== "token"; // Exclude 'token'
                          })
                          .map(([field, value]) => (
                            <div>
                              {field !== "image" && field !== "banner" && (
                                <div
                                  key={field}
                                  className="py-3 sm:py-5 gap-8 items-center flex sm:grid sm:grid-cols-3  sm:px-6"
                                >
                                  <dt className="text-sm whitespace-nowrap font-medium text-gray-500">
                                    {field?.replaceAll("_", " ")}
                                  </dt>
                                  <dd className=" text-ellipsis w-full truncate text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {editBlock ? (
                                      <input
                                        type="text"
                                        value={
                                          inputs?.[field?.replaceAll("_", " ")]
                                        }
                                        onChange={(e) =>
                                          setInputs((prevState) => ({
                                            ...prevState,
                                            [field?.replaceAll("_", " ")]:
                                              e.target.value,
                                          }))
                                        }
                                        className="py-1.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                        placeholder="Enter data"
                                      />
                                    ) : (
                                      <>
                                        {renderFieldValue(field, value) ||
                                          field?.replaceAll("_", " ")}
                                      </>
                                    )}
                                  </dd>
                                </div>
                              )}
                            </div>
                          ))}
                      </dl>
                    </div>
                  </div>
                </form>
                {/* Edit user code ends here */}
              </div>
            </div>
          </div>
          <div className="w-1/3 ">
            <Signin />
          </div>
        </div>
      )}
    </>
  );
}
