"use client";
import React, { useEffect, useState } from "react";
import { accountServerUrl } from "../../../utils/urls";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${accountServerUrl}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies are sent with the request
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData?.error || "Failed to fetch users");
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const userData = await response.json();
        setUsers(userData); // Ensure userData is the correct array
        console.log("Fetched Users:", userData);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-10">
      <div className="grid gap-6 grid-cols-5">
        {error && <p className="text-red-500">{error}</p>}
        {users?.length === 0 && !error && (
          <p className="col-span-5 text-center text-gray-500">
            No users found. Please check back later.
          </p>
        )}
        {users?.map((user: any, index) => (
          <div
            key={index}
            className="flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
          >
            <img
              className="w-full h-auto rounded-t-xl"
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
              }
              alt={`${user?.firstName} ${user?.lastName} - Profile Picture`}
            />
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {`${user?.firstName} ${user?.lastName}`}
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                {user?.email}
              </p>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                {user?.role}
              </p>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                {user?.country}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
