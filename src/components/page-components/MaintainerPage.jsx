"use client";
import React, { useEffect, useState } from "react";
import { renderFieldValue } from "../../../utils/renderFieldValue";
import { accountServerUrl } from "../../../utils/urls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";

export default function MaintainerPage() {
  const [user, setUser] = useState({});
  const [errorForFailedTargetUserFetch, setErrorForFailedTargetUserFetch] =
    useState("");
  const [targetUser, setTargetUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState(user);
  const [editBlock, setEditBlock] = useState(false);
  useEffect(() => {
    import("preline");
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${accountServerUrl}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setInputs(user); // Sync inputs when user changes
  }, [user]);

  const fetchTargetUser = async () => {
    try {
      const response = await fetch(`${accountServerUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const json = await response?.json();
      if (!response.ok) {
        setErrorForFailedTargetUserFetch(json.error);

        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`
        );
      }

      const usersData = await response.json();

      const { firstName, lastName, email } = inputs;
      const targetUser = usersData.find((user) => {
        const matchesByEmail = email && user.email === email;
        const matchesByName =
          firstName &&
          lastName &&
          user.firstName === firstName &&
          user.lastName === lastName;
        return matchesByEmail || matchesByName;
      });

      setTargetUser(targetUser || {});
      console.log({ targetUser });
    } catch (err) {
      console.error("Error fetching target user:", err);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = toast.loading("Updating user information...");

    try {
      const response = await fetch(`${accountServerUrl}/role-update`, {
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
        });
        fetchTargetUser();
      } else {
        toast.update(id, {
          render: `${json.error}`,
          type: "error",
          isLoading: false,
        });
      }
    } catch (error) {
      toast.update(id, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
      });
    } finally {
      setLoading(false);
      toast.dismiss(id);
    }
  };

  return (
    <div>
      {" "}
      <div className="w-full bg-white">
        <ToastContainer />

        <div className="p-4  lg:px-10 px-0 lg:flex gap-10 w-full justify-between">
          <div className="w-full lg:w-1/2   space-y-6">
            <div className="bg-white h-fit overflow-hidden shadow rounded-lg border">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Profile Information
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
          <div className="w-full   lg:w-1/2">
            <div className="flex">
              <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600">
                <nav
                  className="flex gap-x-1"
                  aria-label="Tabs"
                  role="tablist"
                  aria-orientation="horizontal"
                >
                  <button
                    type="button"
                    className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-neutral-800 hs-tab-active:dark:text-neutral-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 font-medium rounded-lg hover:hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-white dark:focus:text-white active"
                    id="segment-item-1"
                    aria-selected="true"
                    data-hs-tab="#segment-1"
                    aria-controls="segment-1"
                    role="tab"
                  >
                    Name & Surname
                  </button>
                  <button
                    type="button"
                    className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-neutral-800 hs-tab-active:dark:text-neutral-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 font-medium rounded-lg hover:hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-white dark:focus:text-white"
                    id="segment-item-2"
                    aria-selected="false"
                    data-hs-tab="#segment-2"
                    aria-controls="segment-2"
                    role="tab"
                  >
                    Email
                  </button>
                </nav>
              </div>
            </div>

            <div className="mt-3">
              <div
                id="segment-1"
                role="tabpanel"
                aria-labelledby="segment-item-1"
              >
                <p className="mt-1 max-w-2xl text-sm mb-3 text-gray-500">
                  Search And Update By Name & Surname
                </p>
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
                        Search and update the role of the target user
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
                              {(field === "role" ||
                                field === "firstName" ||
                                field === "lastName") && (
                                <div
                                  key={field}
                                  className="py-3 sm:py-5 gap-8 items-center flex sm:grid sm:grid-cols-3  sm:px-6"
                                >
                                  <dt className="text-sm whitespace-nowrap font-medium text-gray-500">
                                    {field?.replaceAll("_", " ")}
                                  </dt>
                                  <dd className=" text-ellipsis w-full truncate text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              <div
                id="segment-2"
                className="hidden"
                role="tabpanel"
                aria-labelledby="segment-item-2"
              >
                <p className="mt-1 max-w-2xl text-sm mb-3 text-gray-500">
                  Search & Update By Email Address
                </p>
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
                        Search and update the role of the target user
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
                              {(field === "role" || field === "email") && (
                                <div
                                  key={field}
                                  className="py-3 sm:py-5 gap-8 items-center flex sm:grid sm:grid-cols-3  sm:px-6"
                                >
                                  <dt className="text-sm whitespace-nowrap font-medium text-gray-500">
                                    {field?.replaceAll("_", " ")}
                                  </dt>
                                  <dd className=" text-ellipsis w-full truncate text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white h-fit overflow-hidden shadow rounded-lg border">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Updated User's Information
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {errorForFailedTargetUserFetch ? (
                    <p className="mt-1 p-5  max-w-2xl text-sm text-red-600">
                      {errorForFailedTargetUserFetch}
                    </p>
                  ) : (
                    <>
                      {Object.entries(targetUser || {}).map(
                        ([field, value]) => (
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
                        )
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
