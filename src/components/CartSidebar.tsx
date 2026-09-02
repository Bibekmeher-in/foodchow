"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Store, Tag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/services/api";

export const CartSidebar: React.FC = () => {
  const {
    cart,
    orderType,
    setOrderType,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal,
    taxAmount,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutModalOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) {
      setInputCoupon("");
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-xs h-full min-h-[520px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-gray-900 text-base">Your Cart</h2>
        </div>
        <div className="flex items-center gap-2">
          {itemCount > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
              title="Clear entire cart"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-3 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-1.5 bg-gray-200/80 p-1 rounded-xl">
          <button
            onClick={() => setOrderType("delivery")}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              orderType === "delivery"
                ? "bg-white text-primary shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery</span>
          </button>
          <button
            onClick={() => setOrderType("pickup")}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              orderType === "pickup"
                ? "bg-white text-primary shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Take Away</span>
          </button>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-24 h-24 mb-3 opacity-70">
            <Image
              src="https://admin.foodchow.com/img/add-cart.png"
              alt="Empty Cart"
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm mb-1">Your cart is empty</h3>
          <p className="text-xs text-gray-500 max-w-[200px]">
            Add delicious food items to satisfy your cravings. 🍽️
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
          {cart.map((cartItem) => {
            const hasCustomizations =
              Object.values(cartItem.selectedCustomizations).flat().length > 0;
            const hasPreferences =
              Object.values(cartItem.selectedPreferences).flat().length > 0;

            return (
              <div
                key={cartItem.cartItemId}
                className="flex flex-col bg-gray-50/80 rounded-xl p-3 border border-gray-200/70 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 min-w-0">
                    <div
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-xs border p-0.5 mt-0.5 shrink-0 ${
                        cartItem.item.IsVeg === 1
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-red-600 bg-red-50"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          cartItem.item.IsVeg === 1 ? "bg-emerald-600" : "bg-red-600"
                        }`}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2">
                      {cartItem.item.ItemName}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm shrink-0">
                    {formatPrice(cartItem.totalPrice)}
                  </span>
                </div>

                {cartItem.selectedSize && (
                  <div className="text-[11px] text-primary font-medium mt-1 pl-5">
                    Size: {cartItem.selectedSize.SizeName}
                  </div>
                )}

                {hasCustomizations && (
                  <div className="text-[11px] text-gray-500 mt-0.5 pl-5 space-y-0.5">
                    {Object.values(cartItem.selectedCustomizations)
                      .flat()
                      .map((ing) => (
                        <div key={ing.IngredientId}>
                          + {ing.IngredientName}{" "}
                          {ing.Price > 0 ? `(${formatPrice(ing.Price)})` : ""}
                        </div>
                      ))}
                  </div>
                )}

                {hasPreferences && (
                  <div className="text-[11px] text-gray-500 mt-0.5 pl-5 space-y-0.5">
                    {Object.values(cartItem.selectedPreferences)
                      .flat()
                      .map((p) => (
                        <div key={p.option_id}>• {p.option_name}</div>
                      ))}
                  </div>
                )}

                {cartItem.notes && (
                  <div className="text-[11px] text-amber-700 italic mt-0.5 pl-5">
                    Note: "{cartItem.notes}"
                  </div>
                )}

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60 pl-5">
                  <span className="text-[11px] text-gray-500">
                    {formatPrice(cartItem.unitPrice)} each
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(cartItem.cartItemId)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        onClick={() =>
                          updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)
                        }
                        className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-900">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)
                        }
                        className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-3 shrink-0">
          <div className="space-y-1.5">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">{appliedCoupon}</span>
                  <span className="text-emerald-600">(-{formatPrice(discountAmount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-600 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove Coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon code (e.g. FOODCHOW10)"
                  className="flex-1 text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-primary bg-white uppercase placeholder:normal-case"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && !appliedCoupon && (
              <p
                className={`text-[11px] ${
                  couponMsg.success ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 pt-1 border-t border-gray-200/60">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes & Charges (5% GST)</span>
              <span className="font-medium text-gray-900">{formatPrice(taxAmount)}</span>
            </div>
            {orderType === "delivery" && (
              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-primary text-base font-extrabold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer shadow-md shadow-primary/20 active:scale-[0.99]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
