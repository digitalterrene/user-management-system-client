"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { accountServerUrl } from "../../../utils/urls";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = toast.loading("Signing in...");

    try {
      const updatedInputs = {
        ...inputs,
      };

      const response = await fetch(`${accountServerUrl}/signin`, {
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
        setLoading(false);
        setTimeout(() => {
          router.replace("/");
        }, 2000);
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
      }, 5000);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <ToastContainer />
      <div className="dark:bg-slate-900   bg-gray-100 flex h-full items-center py-16">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="  -mt-40 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  Sign in
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account yet?
                  <a
                    className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="/signup"
                  >
                    Sign up here
                  </a>
                </p>
              </div>

              <div className="mt-5">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        for="email"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={inputs?.email}
                          onChange={(e) =>
                            setInputs((prevState) => ({
                              ...prevState,
                              email: e.target.value,
                            }))
                          }
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 border  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                          required
                          aria-describedby="email-error"
                        />
                        <div className="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                          <svg
                            className="h-5 w-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p
                        className="hidden text-xs text-red-600 mt-2"
                        id="email-error"
                      >
                        Please include a valid email address so we can get back
                        to you
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
