import React from 'react';
import Navigation from '../components/Navigation';
import AnimatedBackground from '../components/AnimatedBackground';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AnimatedBackground />
      <main>
        <HeroSection />
        <AboutSection />
      </main>
    </div>
  );
};

export default LandingPage;
