"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, ShoppingBag, UtensilsCrossed, Truck, Calendar, Info } from "lucide-react";
import { RestaurantInfo, OrderType } from "@/types/foodchow";
import { getLogoImageUrl } from "@/services/api";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  restaurant: RestaurantInfo;
}

export const Header: React.FC<HeaderProps> = ({ restaurant }) => {
  const {
    orderType,
    setOrderType,
    itemCount,
    setIsCartOpenMobile,
    setIsBookingModalOpen,
    setIsInfoModalOpen,
  } = useCart();

  const logoUrl = getLogoImageUrl(restaurant.ShopLogo);

  const orderTypes: { id: OrderType; label: string; icon: React.ReactNode }[] = [
    { id: "delivery", label: "Delivery", icon: <Truck className="w-3.5 h-3.5" /> },
    { id: "pickup", label: "Take Away", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: "dine_in", label: "Dine In", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dadada] shadow-xs">
      <div className="mx-auto w-full px-3 py-2 sm:px-4 lg:px-6 lg:py-2.5 max-w-7xl">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-primary/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shadow-xs"
                title="View Restaurant Details"
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={restaurant.ShopName}
                    fill
                    sizes="48px"
                    className="object-cover"
                    priority
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-primary font-extrabold text-sm sm:text-base">FC</span>
                )}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1
                    onClick={() => setIsInfoModalOpen(true)}
                    className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate tracking-tight cursor-pointer hover:text-primary transition-colors"
                  >
                    {restaurant.ShopName}
                  </h1>
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    title="Restaurant Info"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Open
                  </span>
                </div>
                
                <button
                  onClick={() => setIsInfoModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 truncate cursor-pointer hover:text-gray-800 transition-colors text-left"
                >
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">{restaurant.ShopAddress}</span>
                </button>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors cursor-pointer"
                title="Book a Table"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpenMobile(true)}
                className="relative p-2 bg-primary text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-1 lg:pt-0">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="hidden md:flex flex-col items-end text-right pr-2 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to view weekly opening hours"
            >
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0AA89E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AA89E] animate-pulse"></span>
                <span>Restaurant is open</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#7d7d7d]">
                <Clock className="w-3 h-3" />
                <span>{restaurant.timingText}</span>
              </div>
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/50 hover:bg-primary/10 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Table Booking</span>
            </button>

            <div className="flex items-center bg-gray-100 p-0.5 sm:p-1 rounded-lg border border-gray-200 w-full sm:w-auto justify-between sm:justify-start">
              {orderTypes.map((type) => {
                const isActive = orderType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id)}
                    className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 sm:flex-initial cursor-pointer ${
                      isActive
                        ? "bg-white text-primary shadow-xs font-bold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
