# FoodChow Restaurant Menu Web Application

A Next.js + TypeScript web application replicating the restaurant menu and online ordering experience from [foodchowdemoindia.foodchow.com](https://foodchowdemoindia.foodchow.com/), powered by the FoodChow API and an explicit fallback resilience mechanism.

---

## 🚀 Technologies Used

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript (Fully typed interfaces for menu, categories, cart, and customization)
- **Styling**: Tailwind CSS (FoodChow `#0AA89E` teal palette, responsive grids, micro-animations)
- **Icons**: Lucide React
- **Typography**: Poppins (Google Fonts via `next/font`)

---

## 📡 API & Fallback Architecture

The application implements a strict and resilient data fetching and fallback strategy:

```
                  ┌───────────────────────────────┐
                  │  Request FoodChow API (3161)  │
                  └──────────────┬────────────────┘
                                 │
                     Did HTTP Request Succeed?
                                 │
                     ┌───────────┴───────────┐
                    YES                      NO
                     │                       │
              Parse JSON Body                │
                     │                       │
       response.message ===                  │
   "No any records found!" ?                 │
        ┌────────────┴────────────┐          │
       YES                        NO         │
        │                          │         │
        │             Does response contain  │
        │               usable menu data?    │
        │              ┌───────────┴─────────┤
        │             YES                    NO
        │              │                     │
        ▼              ▼                     ▼
┌──────────────┐ ┌───────────┐        ┌──────────────┐
│ Use Fallback │ │ Use Live  │        │ Use Fallback │
│  Menu JSON   │ │ API Data  │        │  Menu JSON   │
└──────────────┘ └───────────┘        └──────────────┘
```

### Fallback Logic Details
- **Explicit Message Check**: When the API responds with `response.message === "No any records found!"`, the application immediately switches to the local fallback dataset (`src/data/fallback-menu.json`).
- **Network Resilience**: In case of network errors, timeouts, HTTP errors, or malformed responses, the app safely catches the error and loads the fallback menu data without breaking the UI.
- **Dynamic JSON Parsing**: The normalizer safely handles both JSON string payloads (`typeof data === "string"`) and object payloads (`typeof data === "object"`).

---

## ✨ Key Features

1. **Dynamic Category Navigation**:
   - Categories are generated dynamically from API/fallback data.
   - Smooth horizontal scrolling pill bar with active indicators and quick jump-to-section navigation.

2. **Menu Item Display**:
   - Cards display item name, price (single price or price range for items with sizes), description, veg/non-veg indicator, and item images from FoodChow.
   - Resilient image handling: if an image is missing or fails to load, gracefully falls back to a clean text-first card format.

3. **Item Customization & Size Modal**:
   - Multi-size support (e.g. Regular Size, Family Size) with real-time price updates.
   - Add-ons and preferences fetched directly from the FoodChow item customization endpoint.
   - Special instructions / notes textarea.

4. **Search & Filter**:
   - Real-time search across dish names and descriptions.
   - Veg / Non-Veg / All items toggle filter.

5. **Cart & Order Summary**:
   - Interactive cart with quantity increase (`+`), decrease (`-`), and item removal.
   - Delivery / Take Away toggle.
   - Subtotal, 5% GST tax calculation, and delivery fee calculation.
   - Desktop sticky sidebar + Mobile bottom drawer.

6. **Order Placement Demo Flow**:
   - Transparent frontend order confirmation modal summarizing order details, type, and payment method without invented backend SMS claims.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── menu/
│   │       └── route.ts         # REST API endpoint for menu data
│   ├── globals.css              # Custom scrollbars, animations, and Tailwind base
│   ├── layout.tsx               # Root layout with font and CartProvider
│   └── page.tsx                 # Home page (Server Component)
├── components/
│   ├── CartSidebar.tsx          # Cart sidebar and subtotal breakdown
│   ├── CategoryNav.tsx          # Sticky horizontal category navigation
│   ├── CheckoutModal.tsx        # Frontend review & checkout modal
│   ├── CustomizationModal.tsx   # Item size & add-ons customization modal
│   ├── DealsSection.tsx         # Deals/combos section (rendered when present)
│   ├── Footer.tsx               # Standard FoodChow footer
│   ├── Header.tsx               # Header with logo, timing, and order type switcher
│   ├── MenuContainer.tsx        # Main menu grid & category sections
│   ├── MenuItemCard.tsx         # Responsive dish card with veg indicator & price
│   ├── MobileCartBar.tsx        # Floating mobile cart bar & drawer
│   ├── RestaurantInfoModal.tsx  # Restaurant info modal
│   └── SearchBar.tsx            # Live dish search & Veg/Non-Veg filter
├── context/
│   └── CartContext.tsx          # Cart state, search, filter, and modal triggers
├── data/
│   └── fallback-menu.json       # Original fallback menu dataset
├── lib/
│   ├── menu-api.ts              # API fetcher, fallback switcher, and formatting utils
│   └── menu-parser.ts           # Safe JSON parser and normalizer
├── services/
│   └── api.ts                   # Export layer for services
└── types/
    └── menu.ts                  # Clean TypeScript interfaces
```

---

## 🛠️ Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Linting
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
npm start
```
