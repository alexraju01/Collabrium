import React from "react";
import { useState } from "react";

function formatTimeToString(date: Date) {
  const d = new Date(date);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  if (isToday) {
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    location.reload();
  });
}

const Header = () => {
  const username = "user1";
  {
    /*need to change this to actual user name*/
  }
  const currentDate = new Date();

  return (
    <header className="bg-white shadow-sm w-full h-16">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Collabrium</h1>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-gray-700"> Hello, {username}</span>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onclick="logout()">
            Log Out
          </button>
          {/*need to add function to link to login page*/}
          <span className="text-gray-600 font-medium">
            {formatTimeToString(currentDate)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
