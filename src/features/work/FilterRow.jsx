import React from 'react'
import {FiSearch, FiSettings} from "react-icons/fi";

export const FiltersRow = ({ hasProgressFilter = false, hasAddButton = false }) => (
  <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
    {/* Duration Filter */}
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Duration</span>
      <input type="date" className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" />
      <span className="text-sm text-gray-600 dark:text-gray-300">to</span>
      <input type="date" className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" />
    </div>

    {/* Status Filter */}
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
      <select className="border rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
        <option>All</option>
        <option>Ongoing</option>
        <option>Completed</option>
        {hasAddButton && <option>Pending</option>}
        {hasAddButton && <option>Not Started</option>}
      </select>
    </div>

    {/* Progress Filter (only for Projects) */}
    {hasProgressFilter && (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
        <select className="border rounded px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
          <option>0% - 20%</option>
          <option>21% - 50%</option>
          <option>51% - 80%</option>
          <option>81% - 100%</option>
        </select>
      </div>
    )}

    {/* Search Input */}
    <div className="relative">
      <input
        type="text"
        placeholder="Start typing to search"
        className="border pl-8 pr-3 py-1 rounded text-sm w-56 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400"
      />
      <FiSearch className="absolute left-2 top-2 text-gray-400 dark:text-gray-300 text-sm" />
    </div>

    {/* Filters Button */}
    <button className="ml-auto border px-3 py-1 text-sm rounded text-gray-600 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
      <FiSettings className="mr-2" />
      Filters
    </button>
  </div>
);
