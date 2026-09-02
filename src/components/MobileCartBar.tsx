"use client";

import React from "react";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/services/api";
import { CartSidebar } from "@/components/CartSidebar";

export const MobileCartBar: React.FC = () => {
  const { itemCount, grandTotal, isCartOpenMobile, setIsCartOpenMobile } = useCart();

  return (
    <>
      {itemCount > 0 && !isCartOpenMobile && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 lg:hidden animate-slide-up">
          <div className="mx-auto max-w-md bg-primary text-white p-3 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                {itemCount}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-white/80 font-medium leading-none">
                  {itemCount === 1 ? "1 Item added" : `${itemCount} Items added`}
                </span>
                <span className="text-base font-bold leading-tight mt-0.5">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpenMobile(true)}
              className="flex items-center gap-1.5 bg-white text-primary px-4 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {isCartOpenMobile && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in">
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-3.5 border-b border-gray-100 bg-gray-50/70">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="flex items-center gap-2 pt-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="font-bold text-gray-900 text-sm">Cart Details</span>
              </div>
              <button
                onClick={() => setIsCartOpenMobile(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <CartSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
