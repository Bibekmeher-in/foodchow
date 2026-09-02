# FoodChow Restaurant Menu & Online Ordering (Next.js)

A high-performance, responsive restaurant menu and online ordering web application replicating the layout and design of [foodchowdemoindia.foodchow.com](https://foodchowdemoindia.foodchow.com/), powered by the FoodChow API.

## Features

- **Direct API Integration**: Automatically fetches and parses menu categories, items, prices, sizes, and customizations from `https://www.foodchow.com/api/FoodChowWD/GetRestaurantMenuWDWidget_multi?ShopId=3161&locale_id=null`.
- **Exact Layout & Styling**: Replicates the reference UI with `#0AA89E` teal branding, Poppins typography, rounded-xl cards, sticky navigation, and responsive layouts.
- **Horizontal Sticky Category Nav**: Smooth horizontal scrolling pills with active state indicators and jump-to-section navigation.
- **Search & Live Filters**: Real-time dish searching by name/description and Veg / Non-Veg / All filtering.
- **Item Customization & Size Modal**: Supports multi-size selection (e.g., Reg Size, Family Size) with real-time price updates, customizable add-ons, preferences, and special notes.
- **Cart Management**: Desktop sticky cart sidebar and mobile floating drawer with quantity steppers, item removal, Delivery/Pickup toggle, subtotal, 5% tax, and delivery fee calculation.
- **Checkout Flow**: Complete checkout modal with customer details, order type recap, payment methods (Cash/Card), and order confirmation.
- **Clean Human-Logic Code**: Modular, fully typed TypeScript components adhering strictly to standard Next.js and React patterns.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 
- **Icons**: Lucide React
