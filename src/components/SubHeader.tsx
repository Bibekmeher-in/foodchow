"use client";

import React from "react";
import { MenuTab } from "@/types/foodchow";
import { useCart } from "@/context/CartContext";

interface SubHeaderProps {
  menus: MenuTab[];
}

export const SubHeader: React.FC<SubHeaderProps> = ({ menus }) => {
  const { activeMenuUrl, setActiveMenuUrl } = useCart();

  if (!menus || menus.length === 0) return null;

  return (
    <div className="bg-white px-3 sm:px-6 py-2 flex gap-1.5 sm:gap-2 border-b border-[#dadada] overflow-x-auto hide-scrollbar select-none">
      <div className="mx-auto max-w-7xl w-full flex gap-2 items-center">
        {menus.map((menu) => {
          const isActive = activeMenuUrl === menu.menu_url;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenuUrl(menu.menu_url)}
              className="relative px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer"
            >
              <span
                className={`${
                  isActive
                    ? "text-[#0AA89E] font-bold"
                    : "text-[#4a5565] hover:text-[#0AA89E]"
                }`}
              >
                {menu.menu_name}
              </span>
              {isActive && (
                <span className="hidden lg:block bg-[#0AA89E] rounded-full w-[80%] h-0.5 absolute bottom-0 left-1/2 -translate-x-1/2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
