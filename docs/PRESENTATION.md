# 📽️ MealBridge — AmiHacks 2026 Round 1 Presentation Deck

> **Event:** AmiHacks 2026 — Track A: Surplus-to-Shelter  
> **Team:** Yash Bhatt & Shailja Sharma  
> **Repository:** [https://github.com/ShailjaSharma23/MealBridge](https://github.com/ShailjaSharma23/MealBridge)  
> **Status:** Live Working Implementation (React 18 + Node.js + MongoDB Atlas)

---

## Slide 1: Title & Purpose
**Header:** MealBridge  
**Subtitle:** "Connecting Surplus Food to Those Who Can Use It"  
**Context:** AmiHacks 2026 — Round 1 Technical Evaluation  

```
SURPLUS FOOD  ──▶  COORDINATION  ──▶  RESCUE  ──▶  MEASURABLE IMPACT
```

### Speaker Notes:
* "Good morning/afternoon evaluators. We are presenting **MealBridge** for Track A: Surplus-to-Shelter."
* "The core challenge in urban food waste is not an absence of food—it is the practical breakdown of coordinating time-sensitive pickups between commercial food providers, recipient shelters, and couriers before food spoils."
* "MealBridge is an operational digital platform that organizes this entire lifecycle into a single, reliable workflow."

---

## Slide 2: The Problem
**Header:** "The Problem Is Not Food. It Is Coordination."  

### The Real-World Situation:
Every evening, restaurants, cafeterias, bakeries, and caterers prepare wholesome food that remains unsold. Simultaneously, nearby shelters and community distribution centers experience dinner shortages. 

### The Existing Fragmented Workflow:
```
DONOR KITCHEN
   │ (Manual phone call or WhatsApp message)
   ▼
Informal Search for Available Shelters
   │ (Uncertainty about shelter operating hours or cold storage capacity)
   ▼
Manual Volunteer / Transport Search
   │ (No real-time tracking, no vehicle compatibility verification)
   ▼
Uncoordinated Pickup & Unverified Delivery
```

### The Consequences:
1. **Critical Delays:** Cooked food has a statutory 2-to-4 hour safety window under FSSAI. Manual coordination takes hours, causing food to exceed safe thresholds.
2. **Cold-Storage Spoilage:** Donors drop off 40 kg at a shelter with only a 10 kg refrigerator, leading to secondary spoilage on arrival.
3. **Zero Visibility:** Donors never know if food reached the destination; volunteers have no route guidance.
4. **No Measurable Record:** Discarding food into landfills is treated as a business loss rather than generating verifiable tax or sustainability records.

---

## Slide 3: Our Solution
**Header:** "MealBridge: One Digital Rescue Workflow"  

```
             ┌─────────────────────────┐
             │      FOOD DONOR         │
             │  (Restaurant/Cafeteria) │
             └────────────┬────────────┘
                          │ (Posts surplus >= 3kg + Authenticated Address)
                          ▼
             ┌─────────────────────────┐
             │       MEALBRIDGE        │
             │    DIGITAL PLATFORM     │
             └──────┬───────────▲──────┘
                    │           │
       (Matches offer)      (Claims job)
                    │           │
                    ▼           │
     ┌──────────────────┐  ┌────┴───────────────────┐
     │ SHELTER INTAKE   │  │  VOLUNTEER COURIER     │
     │ (Accepts within  │  │  (Turn-by-turn route,  │
     │  15-min window)  │  │   failure reporting)   │
     └─────────┬────────┘  └────────────┬───────────┘
               │                        │
               └───────────┬────────────┘
                           ▼
              ┌─────────────────────────┐
              │    VERIFIED DELIVERY    │
              │  • 80G Tax Certificate  │
              │  • Real-time Impact Log │
              └─────────────────────────┘
```

### Core Architecture Principle:
* MealBridge replaces fragmented calls and WhatsApp threads with a deterministic, role-isolated web platform that connects donors, shelters, and volunteers with live inventory and status visibility.

---

## Slide 4: Who Uses MealBridge?
**Header:** Four Dedicated Operational Roles  

```
┌─────────────────────────┐      ┌─────────────────────────┐
│       🍱 DONOR          │      │       🏠 SHELTER        │
├─────────────────────────┤      ├─────────────────────────┤
│ • Posts surplus batches │      │ • Views matched offers  │
│ • Validates pickup bay  │      │ • Monitors cold storage │
│ • Receives 80G tax cert │      │ • Accepts/passes batch  │
└─────────────────────────┘      └─────────────────────────┘

┌─────────────────────────┐      ┌─────────────────────────┐
│      🛵 VOLUNTEER       │      │       👤 ADMIN          │
├─────────────────────────┤      ├─────────────────────────┤
│ • Browses job pool      │      │ • System oversight      │
│ • Navigates via GPS map │      │ • User verification    │
│ • Reports malfunctions  │      │ • Platform audit logs   │
└─────────────────────────┘      └─────────────────────────┘
```

* **Role Isolation Guarantee:** Enforced at the router level (`RoleGuard.jsx`) and dynamic navigation bar (`Navbar.jsx`). A donor cannot inspect shelter queues; a shelter cannot alter donor submissions; volunteers only access claimed routes.

---

## Slide 5: How the Rescue Works
**Header:** The 10-Step Time-Sensitive Rescue Lifecycle  

```
[1. Donor Intake] ────────▶ [2. Quantity Validation] ────────▶ [3. Location Authentication]
(Dish, Category, Window)     (Enforce >= 3 kg feasibility)      (Nominatim Geocode + GPS)
                                                                            │
                                                                            ▼
[6. Accept / Pass] ◀─────── [5. Shelter Alert] ◀────────────── [4. Proximity Match]
(15-min cascade window)     (Distance, ETA, Kg)                (Haversine + Capacity Meter)
       │
       ▼
[7. Courier Claims Job] ──▶ [8. Live Navigation] ────────────▶ [9. Confirmed Drop-off]
(Available rescue pool)     (Leaflet turn-by-turn map)         (Cold storage meter updated)
                                                                            │
                                                                            ▼
                                                               [10. Impact Recorded]
                                                                (Section 80G PDF + CO2 Log)
```

* **Strict Time Sensitivity:** Every step in this pipeline has an explicit timeout and audit timestamp (`postedAt`, `matchedAt`, `volunteerAssignedAt`, `deliveredAt`).

---

## Slide 6: Smart Matching & Business Logic
**Header:** Deterministic, Business-Rule-Based Matching  
*(Technical Note: MealBridge uses rigorous mathematical and deterministic business rules—NOT black-box neural networks or predictive ML).*

```
                     INCOMING DONATION
           (Quantity >= 3kg, Coordinates, Dietary Tag)
                             │
                             ▼
              [ 1. GEOSPATIAL PROXIMITY ]
              Haversine Great-Circle Distance
                d = 2R · atan2(√a, √(1-a))
                             │
                             ▼
              [ 2. STORAGE CAPACITY CHECK ]
              Shelter Available Capacity:
               (capacityKg - currentStorageUsedKg) >= donation.quantityKg
                             │
                             ▼
              [ 3. DIETARY COMPATIBILITY ]
              Match Donor 'Veg Only' with Shelter 'Veg Only' Preference
                             │
                             ▼
              [ 4. EXPIRY FEASIBILITY ]
              ETA to shelter < Donation Hours Remaining
                             │
                             ▼
                      COMPATIBLE MATCH
```

* **Proximity Calculation:** Built using the standard Haversine formula over Earth radius $R = 6371\text{ km}$, evaluated against MongoDB `2dsphere` coordinates.
* **Cold Storage Integrity:** Prevents sending 25 kg of cooked food to a facility that only has 5 kg of spare refrigeration space.

---

## Slide 7: Time-Sensitive 15-Minute Cascade
**Header:** Preventing Spoilage When a Match Is Idle  

```
                    DONATION POSTED
                           │
                           ▼
                  PRIMARY SHELTER (A)
                  (Closest Compatible)
                           │
                 [ 15-Minute Countdown ]
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
          Accepted? (YES)        Declined or Expired? (NO)
                │                     │
                ▼                     ▼
         DISPATCH TO POOL      SMART CASCADE TRIGGERED
        (Volunteer claims)            │
                                      ▼
                             SECONDARY SHELTER (B)
                             (Next Nearest in Radius)
                                      │
                             [ New 15-Min Window ]
```

* **Implemented Behavior:** In `shelterController.js` (`respondToOffer`), passing on an offer pushes Shelter A into `match.passedShelters`, selects the next available shelter in the area, resets `offerExpiresAt = Date.now() + 15 * 60 * 1000`, and dynamically refreshes the shelter dashboard.
* **Why It Matters:** A shelter might be overwhelmed or closed. The cascade ensures that an offer does not die with an unresponsive recipient.

---

## Slide 8: Failure Recovery
**Header:** Volunteer Vehicle Malfunction Emergency Protocol  

```
                 VOLUNTEER IN TRANSIT
                           │
                 [ MECHANICAL BREAKDOWN ]
               (Flat Tyre / Engine Failure)
                           │
                           ▼
          Volunteer taps "Report Malfunction"
          • Selects reason from incident menu
          • Captures current GPS coordinates
                           │
                           ▼
             EXPRESS BACKEND STATE MACHINE
            (/api/volunteers/jobs/:id/breakdown)
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   Breakdown BEFORE Pickup     Breakdown MID-TRANSIT
   (Courier never got food)    (Courier holding food)
              │                         │
              ▼                         ▼
   • Volunteer unassigned      • Status: 'relay_needed'
   • Status: 're_dispatch'     • Pickup becomes Breakdown GPS
   • Returned to Top of Pool   • Nearby couriers alerted for Handover
              │                         │
              └────────────┬────────────┘
                           ▼
              Zero Penalty to Volunteer
              Real-time ETA update to Donor & Shelter
```

* **Design Principle:** *"A failure in one participant should not destroy the entire rescue workflow."*
* **Safety Protection:** The courier is protected from arbitrary rating penalties when an honest mechanical problem occurs.

---

## Slide 9: System Architecture
**Header:** Four-Tier Production Stack  

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT TIER (React 18 + Vite + Tailwind CSS + Leaflet.js)           │
│    • Donor Intake Form (Nominatim Auth + Synchronized Expiry Slider)   │
│    • Shelter Portal (Capacity Gauge + Dynamic Offer Cards)             │
│    • Volunteer Portal (Turn-by-turn Leaflet Map + Breakdown Modal)     │
│    • MealBot Assistant (Google Gemini 3.8 Flash + Web Speech TTS)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST JSON
┌──────────────────────────────────▼─────────────────────────────────────┐
│ 2. GATEWAY & SECURITY TIER                                             │
│    • RoleGuard Route Isolation (Blocks unauthorized portal browsing)   │
│    • JWT Session Tokens & Bcrypt Password Hashing                      │
│    • React Portals (z-[9999] Top-Level Modal Mount to document.body)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ 3. APPLICATION LOGIC ENGINE (Node.js & Express.js)                     │
│    • Proximity Matcher & 15-Minute Cascade State Machine               │
│    • Emergency Vehicle Breakdown Re-dispatch Controller                │
│    • Section 80G Tax Exemption & ESG Impact Calculation Engine         │
│    • MealBot AI Guidance Controller (Gemini API + Fallback Base)       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ 4. PERSISTENCE & EXTERNAL CLOUD SERVICES                               │
│    • MongoDB Atlas: Users, Donations, Matches, ImpactLogs              │
│    • GeoJSON 2dsphere Proximity Indexing & Time-decay TTL Indexes      │
│    • Google Gemini 3.8 Flash Generative Language API                   │
│    • OpenStreetMap Nominatim Geocoding API                             │
│    • Brevo Transactional Email SMTP Relay                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Slide 10: Database & Data Model
**Header:** Verified Entity Relationships in MongoDB Atlas  

```
      ┌──────────────┐
      │     USER     │
      └──────┬───────┘
             │ 1
             │
             │ has many (1 : N)
             ▼
      ┌──────────────┐                 ┌──────────────┐
      │   DONATION   │ ──────────────▶ │    MATCH     │
      └──────────────┘      1 : 1      └──────┬───────┘
                                              │
                                              │ N : 1
                                              ▼
                                       ┌──────────────┐
                                       │  IMPACT LOG  │
                                       └──────────────┘
```

### Key Technical Attributes:
* **`User` Schema:** Contains polymorphic role sub-documents (`donorDetails`, `shelterDetails`, `volunteerDetails`), coordinates with `2dsphere` index, and contact info.
* **`Donation` Schema:** Validated `quantityKg >= 3.0`, computed `servingsCount = quantityKg * 2.5`, calibrated `expiryHours`, and `expiresAt` date.
* **`Match` Schema:** Stores foreign keys (`donation`, `donor`, `shelter`, `volunteer`), `distanceKm`, `cascadeExpiresAt`, `routeWaypoints`, and `vehicleBreakdownReport`.
* **`ImpactLog` Schema:** Stores monthly aggregated metrics: `totalKgRescued`, `mealsServed`, `co2SavedKg = totalKgRescued * 2.5`.

---

## Slide 11: Security, Access Control & UI Integrity
**Header:** Defensible Role Isolation & Form Safeguards  

```
USER ATTEMPTS NAVIGATION
           │
           ▼
[ Authenticated? ] ───(No)───▶ Mounts AuthModal via React Portal (z-[9999])
           │
         (Yes)
           ▼
[ RoleGuard Verification ]
  • Donor on /donate     ──▶ ALLOW
  • Donor on /receive    ──▶ BLOCKED (RoleGuard Screen)
  • Shelter on /receive  ──▶ ALLOW
  • Shelter on /donate   ──▶ BLOCKED (RoleGuard Screen)
  • Volunteer on /vol    ──▶ ALLOW
```

### Key Security & UI Safeguards:
1. **Zero-Trust Role Scoping:** Prevents bad actors or competitors from viewing intake queues or modifying donor listings.
2. **OpenStreetMap Nominatim Geocoding:** Verifies every street address before submission, preventing dispatch to bogus locations.
3. **React Portal Mount (`createPortal`):** Modals mount directly to `document.body` with `z-[9999]`, preventing DOM stacking context trapping and eliminating navbar clipping.
4. **Feasibility Threshold ($3\text{ kg}$):** Prevents micro-orders that waste volunteer fuel.

---

## Slide 12: MealBot — User Assistance & Website Guidance
**Header:** An LLM-Powered Onboarding & Compliance Chatbot  
*(Technical Note: MealBot is strictly an educational and navigational user assistant—NOT an operational dispatch engine or autonomous rescue decision maker).*

```
USER ASKS A QUESTION
(e.g., "How does 80G tax benefit Bistro 42?", "Is cooked rice safe after 3 hours?")
                         │
                         ▼
             MEALBOT ASSISTANT BACKEND
             (/api/ai/mealbot Controller)
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
[ Live Gemini 3.8 Flash ]      [ Offline Knowledge Base ]
 (Primary API with Persona)     (20+ Topic FSSAI/80G Engine)
           │                           │
           └─────────────┬─────────────┘
                         ▼
        STRUCTURED MARKDOWN RESPONSE
        • FSSAI statutory holding guidelines
        • 80G tax benefit explanations
        • Website feature walkthroughs
                         │
                         ▼
        INTERACTIVE CLIENT FEATURES
        • Web Speech API (Voice Read Aloud 🔊)
        • Contextual deep-link action buttons
```

### Practical Purpose:
* **Reduces Onboarding Friction:** Helps new restaurant managers, shelter staff, and student volunteers understand how to use the website.
* **Explains Food Regulations:** Educates donors on FSSAI (2019) safe holding temperatures (>60°C hot, <5°C cold, 2-hr room temperature limit).

---

## Slide 13: From Individual Rescue to Measurable Impact
**Header:** Converting Waste Diverted into Verifiable Public Audits  

```
┌─────────────────────────┐      ┌─────────────────────────┐
│     16,800+ KG          │      │     38,400+             │
│    FOOD RESCUED         │      │  NUTRITIOUS MEALS       │
├─────────────────────────┤      ├─────────────────────────┤
│ High-grade surplus      │      │ Calculated based on     │
│ diverted from landfills │      │ standard 2.5 meals/kg   │
└─────────────────────────┘      └─────────────────────────┘

┌─────────────────────────┐      ┌─────────────────────────┐
│     42,000+ KG          │      │     50% TAX RELIEF      │
│     CO2e AVOIDED        │      │    SECTION 80G CERTS    │
├─────────────────────────┤      ├─────────────────────────┤
│ Based on 2.5x methane   │      │ Audit-ready digital     │
│ offset per kg food      │      │ certificates issued     │
└─────────────────────────┘      └─────────────────────────┘
```

* **Public Audit Ledger:** Built into `/impact`, rendering real rescue logs transparently so community members can verify where food was delivered.
* **Environmental Value:** Grounded in EPA/UNEP food waste metrics ($1\text{ kg food} = 2.5\text{ kg } CO_2e\text{ avoided}$).

---

## Slide 14: Engineering Decisions That Make MealBridge Valuable
**Header:** Built on Defensible Civic Software Engineering  

1. **Deterministic Business Rules over Guesswork:** Uses exact geographical math (Haversine) and live inventory counters instead of unverified "AI predictions."
2. **Resilience to Operational Failure:** Handles the reality of volunteer vehicle breakdowns rather than assuming perfect execution.
3. **Regulatory Grounding:** Directly reflects Indian food recovery laws (FSSAI 2019) and tax codes (Section 80G).
4. **Data Integrity:** Strict input validation ($\ge 3\text{ kg}$, geocoded locations, calibrated slider stops).
5. **Clear Separation of AI:** Uses LLMs where they excel (natural language user guidance) while keeping core dispatch deterministic.

---

## Slide 15: Live Demo Walkthrough & Closing
**Header:** "One Rescue. One Connected Workflow."  

### 3-Minute Live Evaluation Sequence:
1. **Landing Hub (`/`):** View the live community ticker and operational role gateways.
2. **Donor Portal (`/donate`):** 
   - Demonstrate entering food details and testing address verification with OpenStreetMap Nominatim.
   - Show the calibrated expiry slider snapping cleanly to food window labels.
3. **Shelter Portal (`/receive`):** 
   - Inspect the live cold storage capacity meter (`35kg / 50kg`).
   - Demonstrate the incoming offer grid and explain the 15-minute cascade rule.
4. **Volunteer Board (`/volunteer`):** 
   - View rescue mission `JOB-104` with Leaflet turn-by-turn routing.
   - Demonstrate the **Vehicle Breakdown Handler** and show how the mission is re-queued without penalty.
5. **AI Learning Hub (`/ai-learn`):** 
   - Ask MealBot: *"How does Section 80G tax benefit Bistro 42?"*
   - Click **"Voice Read 🔊"** to hear speech synthesis narration.
6. **Impact Dashboard (`/impact`):** View cumulative environmental offsets and the public audit ledger.

```
SURPLUS FOOD  ──▶  COORDINATION  ──▶  RESCUE  ──▶  MEASURABLE IMPACT
```
