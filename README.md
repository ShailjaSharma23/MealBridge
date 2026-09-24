# 🌉 MealBridge — Real-Time Food Rescue & Shelter Routing Platform
> **AmiHacks 1.0 Submission — Track A: Surplus-to-Shelter**  
> *Connecting surplus food from restaurants and banquet halls directly to verified local shelters with 15-minute smart cascading, volunteer route optimization, and AI food safety intelligence.*

[![Built for AmiHacks 1.0](https://img.shields.io/badge/AmiHacks%201.0-Track%20A%20Surplus--to--Shelter-8BA888?style=for-the-badge)](https://github.com/ShailjaSharma23/MealBridge)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20Tailwind%20%7C%20Leaflet%20%7C%20Gemini-F59E0B?style=for-the-badge)](https://github.com/ShailjaSharma23/MealBridge)
[![License](https://img.shields.io/badge/License-MIT-1E352F?style=for-the-badge)](LICENSE)

---

## 🌟 1. Project Overview & The Real-World Problem

Every single evening in major metropolitan areas, hundreds of kilograms of freshly prepared, high-grade banquet and restaurant food are discarded into landfills, while dozens of neighborhood shelters face severe dinner deficits.

### The 3 Core Breakdowns Solved by MealBridge:
1. **The Time-Decay Trap:** Cooked food has a perishable safety threshold (2–4 hours). Without automated real-time matching, surplus expires before anyone can pick it up.
2. **Cold Storage Mismatch:** Shelters receive bulk donations that exceed their refrigerator capacities, causing secondary food waste.
3. **Logistics Bottleneck:** Donors don't have transport; shelters don't have vehicles. MealBridge coordinates crowdsourced volunteer couriers with turn-by-turn routing.

---

## 🎨 2. Visual Design System

MealBridge is built with a bespoke, human-centered UI matching approved high-fidelity design standards:
- **Primary Color:** Soft Sage Green (`#8BA888` / `#94B49F`) — symbolizes nourishment, growth, and community care.
- **Secondary Accent:** Sunburst Amber (`#F59E0B`) — highlights urgent rescue countdowns and call-to-actions.
- **Background & Cards:** Warm Off-White (`#F9FAFB`) with soft, hyper-rounded borders (`rounded-3xl` / `rounded-2xl`).
- **Interactive Global Role Switcher:** Located in the pinned top navbar (`Profile: Donor ▾` / `Shelter` / `Volunteer` / `Guest`) for frictionless 3-way demonstration during judging presentations.

---

## 📱 3. The 6 Core Modules & Live Features

### 1. 🏠 Central Landing Hub (`/`)
- **Hero Banner:** Dynamic headline with direct dispatch CTAs: `Donate Surplus Food →` & `Join as Volunteer →`.
- **Live Ticker Marquee:** Real-time animated stream of neighborhood rescue operations.
- **Role Cards:** 4 interactive gateways for Donors, Shelters, Volunteers, and MealBot AI.
- **Live City Counters:** Aggregated metrics (16,800+ kg food rescued, 38,400+ meals delivered).

### 2. 🍲 Donor Portal (`/donate`)
- **30-Second Fast Intake Form:** Dish title, food category, quantity slider (kg), preparation time, and photo auto-fill preview.
- **Live 4-Stage Pipeline:** Visual tracking stepper:
  $$\text{Posted} \longrightarrow \text{Matched with Hope Shelter} \longrightarrow \text{Volunteer Assigned} \longrightarrow \text{Delivered}$$
- **Automated ESG & 80G Tax Exemption:** Generates downloadable corporate tax receipts and sustainability certificates.

### 3. 🏢 Shelter / NGO Portal (`/receive`)
- **Cold Storage Meter:** Real-time capacity bar (`35kg / 50kg Used - 70%`) protecting against cold-chain overflow.
- **Dietary Preference Tags:** Custom tags (`Veg Only`, `Cooked Meals Accepted`).
- **Incoming Matched Offers Grid (3x2):** Live countdown timers (`⏰ Expires in 1 hr 15 min`).
- **15-Minute Smart Cascade Algorithm:** If a shelter passes or does not respond within 15 minutes, MealBridge automatically cascades the offer to the next nearest shelter.

### 4. 🚚 Volunteer Rescue Board (`/volunteer`)
- **Category Filter Tabs:** `All Available (6)`, `Near Me (<3km)`, and `Urgent (<90 mins) ⚡`.
- **Interactive Route Map (Leaflet.js):** Custom CartoDB Positron maps rendering pickup donor (`Bistro 42`), dropoff shelter (`Hope Shelter`), and route polyline with live distance/ETA metrics.
- **Rescue Mission Pipeline (Job `#JOB-104`):** 3-stage stepper:
  $$\text{Claim Rescue Job} \longrightarrow \text{Confirm Pickup} \longrightarrow \text{Mark Delivered} \text{ (Confetti Celebration 🎉)}$$
- **Volunteer Milestones:** Track record of 12 deliveries, 186 kg rescued, and verified courier badges.

### 5. 🤖 MealBot AI Learning Hub (`/ai-learn`)
- **MealBot AI Knowledge Assistant:** Real-time chat powered by Google Gemini API + built-in food safety rule engine for FSSAI compliance, safe holding temperatures, and legal donor protections.
- **Interactive Expiry Risk Calculator:** Category dropdown + hours elapsed slider $\rightarrow$ dynamic circular SVG safety gauge (0–100%) and microbiological decay evaluation.
- **Guideline Knowledge Cards:** FSSAI Standards, Good Samaritan Legal Protections, and Shelter FIFO protocols.

### 6. 📊 Real-Time Impact Dashboard (`/impact`)
- **Top Metric Cards:** Rescued weight, meals fed, active shelters, and CO2 emissions avoided (+24% monthly growth).
- **Growth Area Chart (Recharts):** Trajectory from Jan (5.2k kg) to Jun (16.8k kg) with sage gradient.
- **Surplus Category Donut Chart:** Breakdown across Cooked Meals (42%), Bakery (28%), Produce (18%), and Other (12%).
- **City Rescue Hotspot Map:** Interactive Leaflet density map plotting donor and shelter hubs across Delhi NCR.
- **Public Audit Ledger:** Live transparent transaction feed of verified deliveries.

---

## 🚀 4. Quickstart Guide (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local community server running on port `27017` or a MongoDB Atlas URI)

### 1. Clone & Install
```bash
git clone https://github.com/ShailjaSharma23/MealBridge.git
cd MealBridge

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment Variables
Create `backend/.env` (a template is provided in `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mealbridge
JWT_SECRET=mealbridge_jwt_secret_super_secure_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database with Realistic Demo Data
From the root directory:
```bash
npm run data:import
```
This populates:
- 10 Users (Verified Donors, Shelters, Volunteers)
- 6 Donations with time-decay timestamps
- 6 Matches including Rescue Job `JOB-104`
- Delhi NCR Geo coordinates and June 2026 Impact metrics

### 4. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173`

---

## 🧪 5. Automated Verification Suite
To verify all backend API routes and data integrity:
```bash
# In backend/
node utils/verifyApi.js
```
To verify production bundle build:
```bash
# In frontend/
npm run build
```

---

## 👥 6. Team & Credits
- **Yash Bhatt** — Full Stack Architecture, Real-Time Routing, Frontend Engineering & Database Design
- **Shailja Sharma** — UI/UX Design, AI System Integration, Safety Compliance & Impact Analytics

*Proudly developed for **AmiHacks 1.0 (Track A: Surplus-to-Shelter)**.*