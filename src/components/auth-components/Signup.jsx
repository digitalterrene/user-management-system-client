"use client";
import React, { useState } from "react";
import { accountServerUrl } from "../../../utils/urls";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [inputs, setInputs] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = toast.loading("Creating new account...");

    try {
      // Fetch random user data
      const randomUserResponse = await fetch("https://randomuser.me/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!randomUserResponse.ok) {
        throw new Error("Failed to fetch random user data");
      }

      // Parse the JSON response
      const randomUserData = await randomUserResponse.json();
      const { name, location, picture } = randomUserData?.results[0] || {};

      const role = "Cool Kid";
      const updatedUserInfo = {
        role,
        firstName: name?.first,
        lastName: name?.last,
        country: location?.country,
        image: picture?.large,
        banner: picture?.large,
      };

      const updatedInputs = {
        ...inputs,
        ...updatedUserInfo,
      };

      const response = await fetch(`${accountServerUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(updatedInputs),
      });

      const json = await response.json();

      if (response.ok) {
        toast.update(id, {
          render: `${json.message}`,
          type: "success",
          isLoading: false,
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.update(id, {
          render: `${json.error}`,
          type: "error",
          isLoading: false,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error fetching random user data:", error);

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
        router.refresh();
      }, 5000);
    }
  };

  return (
    <div className=" w-full  ">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto  max-w-md  dark:from-blue-950 dark:via-transparent"
      >
        <div className=" w-full mx-auto  flex justify-center">
          <div className="   px-4 py-10 sm:px-6 lg:px-8 lg:py-14  md:w-full w-full lg:mx-auto lg:me-0 ms-auto">
            <div className="p-4 sm:p-7 flex flex-col bg-white rounded-2xl border w-full  shadow-lg dark:bg-slate-900">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Get Started
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?
                  <a
                    className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="/signin"
                  >
                    Sign in here
                  </a>
                </p>
              </div>

              <div className="mt-5">
                <div>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={inputs?.email}
                      onChange={(e) =>
                        setInputs((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }))
                      }
                      id="hs-hero-signup-form-floating-input-email"
                      className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500  border disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                      placeholder="you@email.com"
                    />
                    <label
                      htmlFor="hs-hero-signup-form-floating-input-email"
                      className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:text-xs
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500
                        peer-[:not(:placeholder-shown)]:text-xs
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500"
                    >
                      Email
                    </label>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
