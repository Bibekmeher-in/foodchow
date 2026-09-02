"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { VegFilterType } from "@/types/foodchow";

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, vegFilter, setVegFilter } = useCart();

  const filterOptions: { id: VegFilterType; label: string; icon?: React.ReactNode }[] = [
    { id: "all", label: "All Items" },
    {
      id: "veg",
      label: "Veg Only",
      icon: (
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
      ),
    },
    {
      id: "non_veg",
      label: "Non-Veg",
      icon: (
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ring-2 ring-red-200" />
      ),
    },
  ];

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="flex items-center bg-gray-50 border border-gray-200 focus-within:border-primary focus-within:bg-white rounded-lg px-3 py-2 transition-all">
            <Search className="w-4 h-4 text-primary shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, group dinners, rice, soup..."
              className="ml-2 w-full text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
          {filterOptions.map((opt) => {
            const isActive = vegFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setVegFilter(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
