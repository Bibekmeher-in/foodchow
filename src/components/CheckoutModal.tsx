"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Truck, Store, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/services/api";

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    orderType,
    grandTotal,
    clearCart,
    isOrderSuccess,
    setIsOrderSuccess,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  if (!isCheckoutModalOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderSuccess(true);
    clearCart();
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setIsOrderSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 text-base sm:text-lg">
            {isOrderSuccess ? "Order Placed Successfully" : "Review & Checkout"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isOrderSuccess ? (
          <div className="p-6 text-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">Thank You For Your Order!</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your order request for <span className="font-semibold text-gray-900">{fullName || "Customer"}</span> has been recorded.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Type:</span>
                <span className="font-semibold text-primary capitalize">
                  {orderType === "delivery" ? "Home Delivery" : "Take Away"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {paymentMethod === "cash" ? "Cash on Delivery" : "Card / Online"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-primary text-base">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md shadow-primary/20"
            >
              Order More Food
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20">
                {orderType === "delivery" ? (
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Store className="w-5 h-5 text-primary shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-bold text-gray-900 capitalize block">
                    {orderType === "delivery" ? "Delivery to your address" : "Pickup from restaurant"}
                  </span>
                  <span className="text-gray-500">Estimated ready time: 30-45 mins</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact Details
                </h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Enter Your Name"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 xxxxxxxxxx"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>

                {orderType === "delivery" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, apartment, flat no, landmark..."
                      rows={2}
                      className="w-full text-xs sm:text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Payment Option
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold">Cash</span>
                  </label>
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold">Card / Online</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order Summary ({cart.length} items)
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {cart.map((i) => (
                    <div
                      key={i.cartItemId}
                      className="flex justify-between text-xs text-gray-600"
                    >
                      <span className="truncate pr-2">
                        {i.quantity}x {i.item.ItemName}{" "}
                        {i.selectedSize ? `(${i.selectedSize.SizeName})` : ""}
                      </span>
                      <span className="font-semibold text-gray-900 shrink-0">
                        {formatPrice(i.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>Grand Total:</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/70 shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-between bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer shadow-md shadow-primary/20"
              >
                <span>Confirm & Place Order</span>
                <span>{formatPrice(grandTotal)}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
