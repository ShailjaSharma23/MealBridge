import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Users, Leaf, Heart, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const HeroSection = () => {
  const heroRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance animation
      gsap.from('.hero-animate', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // Gentle floating animation on the hero box
      gsap.to(boxRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-6 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Tagline Pill with Logo */}
            <div className="hero-animate inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-warm-border shadow-xs text-xs font-semibold text-forest">
              <img src="/logo.png" alt="MealBridge" className="w-4 h-4 rounded-md object-cover shadow-xs" />
              <span className="font-bold text-forest">Meal<span className="text-sage-600">Bridge</span></span>
              <span className="text-sage-300">•</span>
              <span className="text-forest/70">Good Food</span>
              <span className="text-sage-300">•</span>
              <span className="text-forest/70">Less Waste</span>
              <span className="text-sage-300">•</span>
              <span className="text-forest/70">Stronger Communities</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-animate font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-forest tracking-tight leading-[1.12]">
              Connecting Surplus Food to{' '}
              <span className="text-sunburst-500 underline decoration-sunburst-300/40 decoration-wavy decoration-2">
                Local Shelters
              </span>{' '}
              in Real Time
            </h1>

            {/* Subtitle */}
            <p className="hero-animate text-base sm:text-lg text-forest/75 leading-relaxed max-w-xl">
              MealBridge helps <strong>restaurants, cafes, and food businesses</strong> reduce food waste by
              connecting surplus edible food with local shelters and communities —{' '}
              <span className="text-forest font-semibold">in under 30 seconds</span>.
            </p>

            {/* Action Buttons */}
            <div className="hero-animate flex flex-wrap gap-4 pt-2">
              <Link
                to="/donate"
                className="btn-sage text-base px-7 py-3.5 shadow-sm group"
              >
                <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Donate Surplus Food</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/volunteer"
                className="btn-amber-outline text-base px-7 py-3.5 group"
              >
                <Users className="w-5 h-5 text-sunburst-500 group-hover:scale-110 transition-transform" />
                <span>Join as Volunteer</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 3 Core Value Badges */}
            <div className="hero-animate pt-4 flex flex-wrap gap-6 text-xs sm:text-sm font-medium text-forest/70">
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-sage-500" /> Reduce Food Waste
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" /> Fight Hunger
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sunburst-500" /> Build Stronger Communities
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Playful Floating Annotation */}
            <div className="absolute -top-6 left-4 sm:left-10 text-xs sm:text-sm font-bold text-forest/80 italic transform -rotate-6 z-20 flex items-center gap-1">
              <span>Surplus Today... ➔</span>
            </div>

            <div className="absolute -bottom-6 right-4 sm:right-8 text-xs sm:text-sm font-bold text-forest/80 italic transform rotate-6 z-20 flex items-center gap-1">
              <span>Hope Tomorrow ➔</span>
            </div>

            {/* Hero Food Box Card */}
            <div
              ref={boxRef}
              className="relative w-full max-w-md bg-white rounded-3xl p-4 shadow-2xl border border-warm-border transform transition-transform"
            >
              {/* Box Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-sage-50">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="MealBridge fresh surplus food box"
                  className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-forest shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-ping" />
                  <span>Fresh & Safe for Shelters</span>
                </div>
              </div>

              {/* Box Branding Label */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-sunburst-200 text-center">
                <div className="font-display font-extrabold text-lg text-forest flex items-center justify-center gap-1.5">
                  MealBridge 🌉
                </div>
                <div className="text-xs text-forest/60 italic font-medium mt-0.5">
                  Real Food. Real Impact.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
