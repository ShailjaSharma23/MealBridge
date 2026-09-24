/**
 * AI Controller for MealBot Assistant & AI Expiry Risk Calculator
 */

export const chatMealBot = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const query = message.toLowerCase();

    // 1. If Gemini API key is configured, we can call Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are MealBot, the friendly, expert AI Assistant for MealBridge, a real-time food rescue platform connecting restaurants and shelters. Answer the user's question clearly, warmly, and concisely (under 4 sentences) focusing on food safety, donation ethics, tax deductions (80G), or volunteer logistics. Question: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiReply) {
          return res.json({
            success: true,
            reply: aiReply.trim(),
            source: 'gemini-ai',
          });
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to rule engine:', err.message);
      }
    }

    // 2. Intelligent Built-in Knowledge Base Engine (guaranteed fast response matching UI mockups)
    let reply = '';

    if (query.includes('rice') && (query.includes('hour') || query.includes('safe'))) {
      reply =
        "Cooked rice is generally safe for consumption within 2 hours at room temperature. After 3 hours, the risk of bacterial growth (Bacillus cereus) increases significantly. It's best to refrigerate it within 2 hours or discard it.";
    } else if (query.includes('tax') || query.includes('80g') || query.includes('deduction')) {
      reply =
        'Donations made through MealBridge qualify for 80G tax deduction benefits under Indian income tax guidelines. Verified donors receive an automated digital ESG & Tax receipt that can be attached to corporate tax filings.';
    } else if (query.includes('cannot') || query.includes('prohibited') || query.includes('not allow')) {
      reply =
        'Foods that cannot be accepted include: previously served leftovers/buffet plates, unpasteurized milk, swollen/dented canned goods, and any food left in the temperature danger zone (5°C to 60°C) for over 2 hours.';
    } else if (query.includes('volunteer') || query.includes('deliver') || query.includes('driver')) {
      reply =
        'Volunteers can claim rescue jobs from the Volunteer Portal. You will see pickup and dropoff locations, distance, and remaining expiry time with live GPS turn-by-turn navigation!';
    } else if (query.includes('shelter') || query.includes('cascade')) {
      reply =
        'Shelters have a 15-minute response window to accept or pass matched food. If a shelter passes or does not respond, MealBridge automatically cascades the offer to the next nearest shelter!';
    } else {
      reply =
        'Hello! I am MealBot. You can ask me about safe food holding temperatures (keep hot food >60°C, cold <5°C), 80G tax deductions for restaurants, or how our 15-minute shelter cascade algorithm works.';
    }

    res.json({
      success: true,
      reply,
      source: 'knowledge-engine',
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
