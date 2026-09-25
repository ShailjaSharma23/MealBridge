# 🎓 MealBridge — Viva & Examiner Presentation Cheat Sheet

> **Hackathon Track:** AmiHacks 1.0 — Track A: Surplus-to-Shelter  
> **Team:** Yash Bhatt & Shailja Sharma  
> **Repository:** `https://github.com/ShailjaSharma23/MealBridge`

---

## ⚡ 1. The 30-Second Elevator Pitch
> *"Every evening, metric tons of high-grade banquet food are discarded while nearby shelters face dinner deficits. MealBridge is a real-time, fault-tolerant food rescue platform. We eliminate food waste using a **15-minute smart proximity cascade algorithm**, protect cold-chain integrity through **real-time shelter capacity tracking**, deploy volunteer couriers with **fail-safe vehicle breakdown re-dispatch**, incentivize commercial donors through **automated Section 80G tax certificates**, and provide legal food safety compliance via our **Google Gemini 3.8 Flash-powered MealBot AI with speech synthesis**."*

---

## 🎯 2. Top 10 Technical Questions & Winning Viva Answers

### Q1: How does your matching algorithm work?
* **Answer:** *"Our matching engine operates on three deterministic layers:
  1. **Geospatial Distance:** We use the **Haversine formula** to calculate the great-circle distance between the donor's pickup bay and registered shelters.
  2. **Capacity Validation:** We query the shelter's live inventory meter (`currentStorageUsedKg` vs `maxCapacityKg`) to ensure accepting the food won't cause cold-chain overflow.
  3. **Dietary Compatibility:** We filter by dietary restrictions (e.g., Pure Veg shelters only receive Veg-certified batches). The highest-scoring shelter receives the offer first with a 15-minute exclusivity window."*

---

### Q2: What happens if a shelter ignores or passes on an incoming offer?
* **Answer:** *"We designed the **15-Minute Smart Cascade Rule**. Because surplus cooked meals have a perishable lifespan of 2–4 hours, an offer cannot sit idle. If the primary shelter declines or their 15-minute countdown timer expires, our backend automatically forwards the offer to the second nearest compatible shelter, and dynamically reorganizes the intake grid. This guarantees zero human delay and zero spoilage."*

---

### Q3: What happens if a volunteer's vehicle breaks down after accepting a job?
* **Answer:** *"We engineered a dedicated **Vehicle Malfunction Emergency Protocol**. If a courier experiences a flat tyre, mechanical failure, or battery drain, they tap 'Report Malfunction' on their active mission card, select the issue, and provide their live location. 
  Our backend immediately removes their assignment with **zero penalty or rating loss**, re-flags the mission as high-priority (`re_dispatch_needed`), and places it at the very top of the Available Rescue Pool for the next nearest courier while updating the donor and shelter ETAs in real time."*

---

### Q4: Why is there a 3 kg minimum threshold for donations?
* **Answer:** *"Dispatching a motorized courier across town for 1 kg (~2 portions) is environmentally and economically counterproductive—the vehicle's carbon emissions exceed the environmental value of the food saved. Industry best practices (e.g., Feeding India, Robin Hood Army) require a minimum threshold of **3 kg (~8–10 meals)** for courier dispatch. For micro-donations under 3 kg, our UI guides users to bundle items or use local community fridges."*

---

### Q5: How do you prevent fake or spam pickup addresses?
* **Answer:** *"We implemented **two-tier location authentication**:
  1. **Live Geocoding Authentication:** When a donor types an address, our system verifies it against the **OpenStreetMap Nominatim API**. If someone enters gibberish like `'abc nagar, xyz road'`, the service returns 0 results and blocks submission with an unauthenticated location warning.
  2. **GPS Authentication:** Donors can tap 'Detect GPS' to capture true browser geolocation coordinates, which are reverse-geocoded and marked with an authenticated green security seal."*

---

### Q6: How does MealBot AI work, and what LLM powers it?
* **Answer:** *"MealBot is powered by **Google's Gemini 3.8 Flash** model via the Generative Language API. It is fine-tuned with an executive prompt covering the **FSSAI Surplus Food Regulations (2019)**, Section 80G tax law, food microbiology (*Bacillus cereus*, *Salmonella*), and carbon offset metrics. 
  It also features a 20+ topic built-in fallback knowledge base for 100% offline uptime, and incorporates the browser's native **Web Speech API** for interactive voice narration."*

---

### Q7: How do you enforce role confidentiality? Can a donor tamper with shelter offers?
* **Answer:** *"We enforce confidentiality at both the UI and router levels:
  1. **Dynamic Navigation:** In `Navbar.jsx`, donors only see 'Donate'; shelters only see 'Receive'; volunteers only see 'Volunteer Board'.
  2. **RoleGuard Component:** `RoleGuard.jsx` intercepts unauthorized URL navigation (e.g., a donor typing `/receive`), rendering a security block screen.
  3. **Backend Middleware:** All API endpoints authenticate JWT tokens and verify `req.user.role` before permitting mutations."*

---

### Q8: How does Section 80G tax benefit Bistro 42 financially?
* **Answer:** *"Under Section 80G of the Indian Income Tax Act, corporate and restaurant donors can claim a **50% deduction** on the fair market value of food donated through registered NGOs. 
  Instead of paying commercial waste disposal contractors to haul away surplus food as a loss, MealBridge automatically generates an audit-ready, digitally signed 80G certificate that their Chartered Accountant can attach directly to their corporate tax filings."*

---

### Q9: Why did you choose MongoDB Atlas and what indexing strategies do you use?
* **Answer:** *"Food rescue requires flexible, nested schemas (e.g., donor coordinates, shelter capacity meters, route waypoints) that evolve rapidly. 
  We use **MongoDB Atlas** with:
  1. `2dsphere` geospatial indexing on `location.coordinates` for ultra-fast `$nearSphere` proximity queries.
  2. **TTL (Time-To-Live) indexes** on `expiresAt` for automatic cleanup of spoiled food batches.
  3. Compound indexes on `{ status: 1, shelter: 1 }` for sub-50ms query speeds on incoming shelter offers."*

---

### Q10: How did you fix the modal overlay and banner overlap issues?
* **Answer:** *"In modern React, modals nested inside `<header>` become trapped in the header's local CSS stacking context. When headers have `position: sticky; z-50` and sibling elements like scrolling marquees or hero sections have CSS `transform` or `backdrop-filter`, the modal gets cut off and painted underneath the banner.
  We solved this by refactoring `AuthModal` and `RoleProfileModal` with **React Portals (`createPortal(..., document.body)`)** and assigning `z-[9999]`. This mounts the modal directly to the root `<body>`, completely free from any parent container clipping."*

---

## 📊 3. Key Numbers & Metrics to Quote

- **Carbon Offset Formula:** $1\text{ kg surplus food} = 2.5\text{ kg } CO_2e\text{ prevented from landfill methane}$.
- **Meal Calculation:** $1\text{ kg} \approx 2.5\text{ nutritional servings}$.
- **Cascade Window:** **15 minutes** per shelter tier.
- **Minimum Courier Batch:** **3 kg** (~8–10 meals).
- **FSSAI Safe Holding Temps:** Hot food $>60^\circ\text{C}$, Cold food $<5^\circ\text{C}$, Ambient limit: **2 hours**.
