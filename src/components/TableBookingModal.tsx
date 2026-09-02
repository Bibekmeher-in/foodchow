"use client";

import React, { useState } from "react";
import { X, CalendarCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Generate next 30 days for date picker
function getAvailableDates(): { label: string; value: string }[] {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    const value = d.toISOString().split("T")[0];
    dates.push({ label, value });
  }
  return dates;
}

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
  "10:00 PM", "10:30 PM",
];

const AVAILABLE_SLOTS = ["Indoor", "Outdoor", "Window Side", "Private Dining"];

const GUEST_OPTIONS = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6 Guests", "7 Guests", "8+ Guests"];

export const TableBookingModal: React.FC = () => {
  const { isBookingModalOpen, setIsBookingModalOpen } = useCart();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const availableDates = getAvailableDates();

  if (!isBookingModalOpen) return null;

  const isFormValid = selectedDate && selectedTime && selectedSlot && selectedGuests;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedSlot("");
    setSelectedGuests("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Book a table</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* ── Success State ── */
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Table Booked!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your reservation has been recorded for{" "}
                <span className="font-semibold text-gray-800">
                  {availableDates.find((d) => d.value === selectedDate)?.label}
                </span>{" "}
                at <span className="font-semibold text-gray-800">{selectedTime}</span>.
              </p>
            </div>
            <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-gray-900">{availableDates.find((d) => d.value === selectedDate)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-semibold text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seating</span>
                <span className="font-semibold text-gray-900">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guests</span>
                <span className="font-semibold text-gray-900">{selectedGuests}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-md shadow-primary/20"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Booking Form ── */
          <form onSubmit={handleProceed} className="p-5 space-y-5">
            {/* Section 1: Date & Time */}
            <div>
              <p className="text-center text-sm font-semibold text-gray-700 mb-3">Select date and time</p>
              <div className="border border-gray-300 rounded-xl overflow-hidden grid grid-cols-2">
                {/* Select Date */}
                <div className="border-r border-gray-300">
                  <label className="block px-3 pt-2.5 pb-0.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Select date
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 pb-2.5 pt-0.5 text-sm text-gray-700 bg-transparent appearance-none outline-none cursor-pointer pr-8"
                      required
                    >
                      <option value="" disabled>Select date</option>
                      {availableDates.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>

                {/* Select Time Slot */}
                <div>
                  <label className="block px-3 pt-2.5 pb-0.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Select time slot
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 pb-2.5 pt-0.5 text-sm text-gray-700 bg-transparent appearance-none outline-none cursor-pointer pr-8"
                      required
                    >
                      <option value="" disabled>Select time slot</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Slot & Guests */}
            <div>
              <p className="text-center text-sm font-semibold text-gray-700 mb-3">Select slots and number of guests</p>
              <div className="border border-gray-300 rounded-xl overflow-hidden grid grid-cols-2">
                {/* Available Slot */}
                <div className="border-r border-gray-300">
                  <label className="block px-3 pt-2.5 pb-0.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Available slot
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 pb-2.5 pt-0.5 text-sm text-gray-700 bg-transparent appearance-none outline-none cursor-pointer pr-8"
                      required
                    >
                      <option value="" disabled>Available slot</option>
                      {AVAILABLE_SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block px-3 pt-2.5 pb-0.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Number of guests
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGuests}
                      onChange={(e) => setSelectedGuests(e.target.value)}
                      className="w-full px-3 pb-2.5 pt-0.5 text-sm text-gray-700 bg-transparent appearance-none outline-none cursor-pointer pr-8"
                      required
                    >
                      <option value="" disabled>Select number of guests</option>
                      {GUEST_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-md ${
                isFormValid
                  ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                  : "bg-red-200 text-white cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
