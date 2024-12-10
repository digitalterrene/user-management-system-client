"use client";
import React from "react";

export default function page() {
  return (
    <div className="h-full bg-gray-50">
      <div className="flex items-center h-full w-full  bgs-gray-900  bg-gray-50 texst-gray-100  text-gray-800">
        <div className=" flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="mb-8 font-extrabold text-9xl text-gray-600 dark:text-gray-400">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn't find this page.
            </p>
            <p className="mt-4 mb-8 text-gray-400 dark:text-gray-600">
              Please go to home to see available routes to visit
            </p>
            <a
              rel="noopener noreferrer"
              href="/"
              className="px-8 py-3 font-semibold rounded bg-violet-400 dark:bg-violet-600 text-gray-900 dark:text-gray-50"
            >
              Go to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
