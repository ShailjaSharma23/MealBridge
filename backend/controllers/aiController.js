/**
 * AI Controller for MealBot Assistant & AI Expiry Risk Calculator
 */

export const chatMealBot = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const query = message.toLowerCase().trim();

    // 1. Live Google Gemini 3.8 Flash Generation
    if (process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are MealBot 🤖, the advanced AI Food Rescue & Compliance Specialist for MealBridge (India's leading surplus food redistribution network).
Your role is to advise commercial donors (restaurants, bakeries, corporate cafeterias), shelters, and volunteer couriers.
You are an authoritative expert on:
1. FSSAI Regulations: Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations, 2019. Strict 2-hour ambient window, hot-holding at >60°C, cold-chain at <5°C.
2. Section 80G Tax Deductions: 50% tax deductions under the Indian Income Tax Act for food donors, verifiable digital donation receipts, and ESG credits.
3. MealBridge Platform Architecture: Haversine distance smart matching, 15-minute shelter cascade protocol, and zero-penalty volunteer breakdown re-dispatch protocol.
4. Food Microbiology: Pathogens (Bacillus cereus in rice, Salmonella in poultry, Staphylococcus aureus) and food perishability.
5. Environmental ESG Impact: 1 kg food rescued = ~2.5 kg CO2e emissions prevented from landfill methane generation.

Always format your response with clean markdown:
- Use bullet points for steps or key facts.
- Highlight important statutory rules or temperatures in bold.
- Keep the tone encouraging, professional, and authoritative (under 5 concise sentences or 4 bullet points).
Question: ${message}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return res.json({
              success: true,
              reply: aiReply.trim(),
              source: 'gemini-3.8-flash',
            });
          }
        } else {
          console.warn('Gemini 3.8 Flash API returned status:', response.status);
        }
      } catch (err) {
        console.warn('Gemini API call failed, activating safety knowledge engine:', err.message);
      }
    }

    // 2. Intelligent Built-in Knowledge Base Engine (Guaranteed High-Impact Response for Hackathon Demos)
    let reply = '';
    let category = 'general';

    if (query.includes('rice') && (query.includes('hour') || query.includes('safe') || query.includes('temp') || query.includes('bacillus'))) {
      category = 'food-safety';
      reply =
        `🍚 **Cooked Rice Safety & Shelf-Life Protocol (FSSAI Guidelines)**:\n\n` +
        `* **2-Hour Ambient Limit:** Cooked rice must be consumed or moved to refrigeration within **2 hours** of cooking.\n` +
        `* **Pathogen Risk:** Unrefrigerated rice rapidly incubates *Bacillus cereus* spores, which produce heat-resistant toxins that cannot be destroyed by reheating.\n` +
        `* **Critical Holding Temperatures:** Keep warm holding at **>60°C (140°F)** or rapidly chill to **<5°C (41°F)**.\n` +
        `* **MealBridge Rescue Action:** If rice has been cooked over 3.5 hours at room temperature, it cannot be dispatched to shelters.`;
    } else if (query.includes('tax') || query.includes('80g') || query.includes('deduct') || query.includes('bistro') || query.includes('benefit')) {
      category = 'tax-benefits';
      reply =
        `📜 **Section 80G Tax Deductions & Commercial Benefits for Donors**:\n\n` +
        `* **50% Tax Deduction:** Donating surplus food through MealBridge’s verified NGO partners entitles restaurants (like Bistro 42) to claim a **50% tax deduction** on the fair market value of donated food under Section 80G of the Indian Income Tax Act.\n` +
        `* **Automated Audit-Ready Certificates:** MealBridge automatically issues downloadable digital 80G certificates with unique receipt hashes and verified meal weights.\n` +
        `* **Commercial Savings:** Turns surplus food that would otherwise incur commercial waste hauling fees into legitimate balance sheet savings and certified ESG goodwill!`;
    } else if (query.includes('cascade') || query.includes('15') || query.includes('shelter') || query.includes('matching')) {
      category = 'algorithm';
      reply =
        `⚡ **MealBridge 15-Minute Smart Cascade Algorithm**:\n\n` +
        `* **Haversine Proximity Match:** When a donor posts surplus, our engine scores nearby verified shelters by travel distance, dietary criteria (e.g. Veg Only), and available cold storage capacity.\n` +
        `* **15-Minute Priority Window:** The closest eligible shelter receives exclusive first right-of-refusal with an interactive countdown timer.\n` +
        `* **Automatic Cascade:** If the first shelter declines or the 15-minute timer expires, the offer is instantly forwarded to the next nearest shelter without human delay, guaranteeing zero food spoilage.`;
    } else if (query.includes('breakdown') || query.includes('malfunction') || query.includes('puncture') || query.includes('flat tyre') || query.includes('accident')) {
      category = 'logistics';
      reply =
        `🛵 **Volunteer Vehicle Breakdown & Emergency Rescue Protocol**:\n\n` +
        `* **Zero-Penalty Reassignment:** If a volunteer courier encounters a mechanical malfunction (puncture, engine failure, battery drain), they can tap **"Report Malfunction"** on their active mission card.\n` +
        `* **Instant Mission Re-Queue:** The mission is immediately unassigned with zero penalty or rating impact, and returned to the top of the **Available Rescue Pool** for the nearest available courier.\n` +
        `* **Donor & Shelter Sync:** Real-time push updates notify both donor kitchen and receiving shelter of the revised ETA so food remains temperature-protected.`;
    } else if (query.includes('cannot') || query.includes('prohibited') || query.includes('not allow') || query.includes('reject')) {
      category = 'compliance';
      reply =
        `🚫 **Prohibited Items Under FSSAI Food Recovery Regulations**:\n\n` +
        `* **Served Leftovers:** Any food served to customer tables or half-eaten buffet plate remnants.\n` +
        `* **Temperature-Abused Items:** Cooked meals held in the Danger Zone (5°C to 60°C) for **more than 4 hours**.\n` +
        `* **Damaged Packaging:** Dented, rusted, or swollen canned goods (indicating botulinum toxin risk).\n` +
        `* **Raw Shellfish & Unpasteurized Dairy:** High-risk raw animal proteins without verified cold-chain logs.`;
    } else if (query.includes('co2') || query.includes('carbon') || query.includes('emission') || query.includes('methane') || query.includes('environment')) {
      category = 'esg';
      reply =
        `🌍 **Environmental ESG Impact & Carbon Offset Metrics**:\n\n` +
        `* **Methane Prevention:** When organic food rots in municipal landfills, it decomposes anaerobically to emit methane (CH4)—a greenhouse gas **28x more potent than CO2**.\n` +
        `* **The 2.5x Formula:** For every **1 kg of food rescued** through MealBridge, approximately **2.5 kg of CO2e emissions** are prevented from entering the atmosphere.\n` +
        `* **City Ledger:** Donors receive audited ESG impact dashboards detailing cumulative CO2 offset, meals served, and landfill waste diverted.`;
    } else if (query.includes('volunteer') || query.includes('courier') || query.includes('deliver') || query.includes('rider')) {
      category = 'logistics';
      reply =
        `🛵 **Volunteer Courier Logistics & Mission Lifecycle**:\n\n` +
        `* **Mission Dispatch:** Volunteers browse available rescue missions sorted by proximity, payload weight (kg), and urgency.\n` +
        `* **Live Turn-by-Turn GPS:** Interactive Leaflet route maps provide pickup bay navigation, donor contact info, and delivery drop-off confirmation.\n` +
        `* **Recognition & Badges:** Volunteers earn verified rescue certificates, milestone badges, and live impact statistics with every delivered batch.`;
    } else {
      category = 'general';
      reply =
        `🤖 **Hello! I am MealBot AI, your MealBridge Food Rescue & Compliance Intelligence Advisor.**\n\n` +
        `Ask me anything about:\n` +
        `* 🌡️ **Food Safety & FSSAI Limits** (*"Is cooked rice safe after 3 hours?"*)\n` +
        `* 📜 **Section 80G Tax Deductions** (*"How does 80G benefit Bistro 42?"*)\n` +
        `* ⚡ **15-Min Shelter Cascade Algorithm** (*"How does smart matching work?"*)\n` +
        `* 🛵 **Courier Logistics & Breakdown Handler** (*"What happens during a vehicle malfunction?"*)\n` +
        `* 🌍 **Landfill Methane & ESG Carbon Savings** (*"Calculate CO2 saved from 50kg food"*)\n\n` +
        `How can I assist your mission today?`;
    }

    res.json({
      success: true,
      reply,
      category,
      source: 'mealbridge-knowledge-engine',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Calculate Expiry Risk Score based on food type and hours since cooked
 * @route  POST /api/ai/calculate-expiry
 * @access Public
 */
export const calculateExpiryRisk = async (req, res, next) => {
  try {
    const { foodType, hoursSinceCooked } = req.body;
    const hours = parseFloat(hoursSinceCooked) || 2.5;
    const type = foodType || 'Cooked Rice';

    // Baseline shelf life limits at room temperature in hours
    const thresholdMap = {
      'Cooked Rice': 4.0,
      'Vegetable Curry': 4.5,
      'Dal & Lentils': 4.0,
      'Bread / Bakery': 12.0,
      'Fresh Fruits / Produce': 24.0,
      'Dairy / Paneer': 3.0,
      'Cooked Pasta': 4.0,
    };

    const maxSafeHours = thresholdMap[type] || 4.0;
    const remainingHours = Math.max(0, maxSafeHours - hours);
    const safetyPercent = Math.max(10, Math.min(98, Math.round((remainingHours / maxSafeHours) * 100)));

    let status = 'Safe';
    let urgencyClass = 'safe';
    let recommendation = `Donate Within ${remainingHours.toFixed(1)} Hours`;

    if (safetyPercent < 35) {
      status = 'High Risk';
      urgencyClass = 'danger';
      recommendation = 'Unsafe for shelter donation. Consider composting.';
    } else if (safetyPercent < 60) {
      status = 'Moderate Risk';
      urgencyClass = 'warning';
      recommendation = `Urgent: Deliver within ${remainingHours.toFixed(1)} Hours`;
    }

    res.json({
      success: true,
      calculation: {
        foodType: type,
        hoursElapsed: hours,
        safetyScore: safetyPercent,
        status,
        urgencyClass,
        recommendation,
        temperatureNote: 'Room Temperature (~25°C)',
        proTip: 'Keep cooked food below 2 hours at room temperature or refrigerate (<5°C) to keep it safe for donation.',
      },
    });
  } catch (error) {
    next(error);
  }
};
