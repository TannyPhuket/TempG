// src/components/Header.jsx
import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Smart Cold Guard</h1>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-100">
          <User size={20} />
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
