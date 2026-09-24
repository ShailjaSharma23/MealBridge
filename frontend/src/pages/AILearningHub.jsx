import React from 'react';
import MealBotChat from '../components/AILearnComponents/MealBotChat.jsx';
import ExpiryCalculator from '../components/AILearnComponents/ExpiryCalculator.jsx';
import GuidelinesCards from '../components/AILearnComponents/GuidelinesCards.jsx';
import { Sparkles, Bot, ShieldCheck } from 'lucide-react';

const AILearningHub = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Page Header matching Photo 5 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sunburst-500" />
            <span>Smart Food Rescue Assistant & Knowledge Hub</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
            MealBot <span className="text-sunburst-500">AI Learning Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 mt-1 max-w-2xl">
            Instant answers on food safety thresholds, real-time microbiological shelf-life calculation, and corporate Section 80G tax compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-xs font-bold text-sage-800 shadow-sm">
            <Bot className="w-4 h-4 text-sage-600" />
            <span>Gemini AI Engine Active</span>
          </span>
        </div>
      </div>

      {/* 2. Side-by-Side: MealBot Chat + Expiry Risk Calculator */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Chat (7 cols) */}
        <div className="lg:col-span-7">
          <MealBotChat />
        </div>

        {/* Right Column: Expiry Risk Calculator (5 cols) */}
        <div className="lg:col-span-5">
          <ExpiryCalculator />
        </div>
      </div>

      {/* 3. Bottom: 3 Core Guidelines Cards */}
      <GuidelinesCards />
    </div>
  );
};

export default AILearningHub;
