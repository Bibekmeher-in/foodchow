import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CustomizationModal } from "@/components/CustomizationModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MobileCartBar } from "@/components/MobileCartBar";
import { TableBookingModal } from "@/components/TableBookingModal";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodChow Demo Restaurant | Order Online",
  description: "Browse our delicious menu, customize your favorite dishes, and order online for delivery or takeout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-gray-100 font-sans antialiased text-gray-900 selection:bg-primary selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
          <CustomizationModal />
          <CheckoutModal />
          <TableBookingModal />
          <MobileCartBar />
        </CartProvider>
      </body>
    </html>
  );
}
