"use client";

import React from "react";
import Image from "next/image";
import { RestaurantInfo } from "@/types/foodchow";

interface FooterProps {
  restaurant: RestaurantInfo;
}

export const Footer: React.FC<FooterProps> = ({ restaurant }) => {
  return (
    <footer className="bg-white border-t border-[#dadada] mt-auto py-3.5 px-4">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#1f2430]">
        <div className="text-[#1f2430] text-xs sm:text-sm md:text-[15px] font-normal">
          {restaurant.fssaiNumber && (
            <span>FSSAI Lic No. {restaurant.fssaiNumber}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[#5c6370] text-xs sm:text-sm md:text-[15px] font-medium">
          <span>Online Ordering System by</span>
          <a
            href="https://www.foodchow.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[100px] sm:w-[110px] h-[24px] sm:h-[28px] flex items-center"
          >
            <Image
              src="https://www.foodchow.com/angular/v2/assets/Images/foodchow-logo.png"
              alt="Foodchow"
              fill
              sizes="110px"
              className="object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
