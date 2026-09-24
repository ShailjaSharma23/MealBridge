import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Home, HeartHandshake, Bot, ArrowRight } from 'lucide-react';

const RoleCards = () => {
  const cards = [
    {
      id: 'donor',
      title: 'Donor',
      tagline: 'Have surplus food?',
      description: 'List your extra food in minutes and help someone in need.',
      link: '/donate',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      btnClass: 'bg-sage-400 hover:bg-sage-500 text-white',
    },
    {
      id: 'shelter',
      title: 'Shelter',
      tagline: 'Need food support?',
      description: 'Get matched with nearby donors in real time.',
      link: '/receive',
      icon: Home,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      btnClass: 'bg-sunburst-500 hover:bg-sunburst-600 text-white',
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      tagline: 'Make a difference.',
      description: 'Help with sorting, delivery, awareness and more.',
      link: '/volunteer',
      icon: HeartHandshake,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
      btnClass: 'bg-sage-400 hover:bg-sage-500 text-white',
    },
    {
      id: 'ai-mealbot',
      title: 'AI MealBot',
      tagline: 'Smarter food. Bigger impact.',
      description: 'Get real-time matches, insights and personalized recommendations.',
      link: '/ai-learn',
      icon: Bot,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      btnClass: 'bg-sunburst-500 hover:bg-sunburst-600 text-white',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-2">
            — GET INVOLVED —
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest tracking-tight">
            Everyone Has a Role to Play
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest/70">
            Whether you have extra food, need support, want to volunteer, or just want to learn more — MealBridge makes it simple.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-6 border border-warm-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${card.iconBg}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display font-bold text-xl text-forest">{card.title}</h3>
                  <div className="text-xs font-semibold text-sunburst-600 mt-0.5">{card.tagline}</div>

                  {/* Description */}
                  <p className="text-sm text-forest/70 mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Redirect Button */}
                <div className="pt-6 mt-6 border-t border-warm-border/60">
                  <Link
                    to={card.link}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs shadow-sm transition-all active:scale-95 ${card.btnClass}`}
                  >
                    <span>Learn & Redirect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
