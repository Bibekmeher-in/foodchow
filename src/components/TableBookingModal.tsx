"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Users, User, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RestaurantInfo } from "@/types/foodchow";

interface TableBookingModalProps {
  restaurant: RestaurantInfo;
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({ restaurant }) => {
  const { isBookingModalOpen, setIsBookingModalOpen } = useCart();

  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("07:00 PM");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isBookingModalOpen) return null;

  const timeSlots = [
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM",
    "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">
              {isSuccess ? "Table Booked!" : "Book a Table"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{restaurant.ShopName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Reservation Confirmed!</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-gray-900">{fullName}</span>. Your table for <span className="font-semibold text-gray-900">{guests} guests</span> on <span className="font-semibold text-gray-900">{date}</span> at <span className="font-semibold text-gray-900">{timeSlot}</span> has been booked.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-1 text-gray-600">
                <p><span className="font-medium text-gray-900">Restaurant:</span> {restaurant.ShopName}</p>
                <p><span className="font-medium text-gray-900">Phone:</span> {restaurant.PhoneNumber}</p>
                <p><span className="font-medium text-gray-900">Address:</span> {restaurant.ShopAddress}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" /> Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        timeSlot === slot
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-primary" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Special Request / Note
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Window seat, anniversary celebration, etc."
                    className="w-full text-xs sm:text-sm p-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md shadow-primary/20 active:scale-[0.99]"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
