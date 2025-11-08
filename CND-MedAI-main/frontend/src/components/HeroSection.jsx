import React from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-0 bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="container-custom text-center">
  <div className="animate-slide-up mt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-medical px-6 py-3 mb-8 border border-teal-200/50 shadow-card">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700 font-body">Revolutionary AI Healthcare Technology</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-display overflow-visible pb-2">
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-1">
              Transforming Medical
            </span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-1">
              Diagnosis with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-body">
            Empowering doctors with intelligent insights for early cancer and neurological disease detection.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center mb-8">
            <Button 
              onClick={() => navigate('/login')}
              className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-medical shadow-medical hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {[
              {
                title: 'Instant AI Analysis',
                desc: 'Get results in seconds for faster decision-making.'
              },
              {
                title: 'Comprehensive Screening',
                desc: 'Covers cancer, neurological, and rare diseases.'
              },
              {
                title: 'Seamless Integration',
                desc: 'Easily connects with hospital systems and workflows.'
              },
              {
                title: 'Privacy First',
                desc: 'Advanced security for patient data protection.'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl shadow-card px-5 py-4 w-56 min-h-[90px] flex flex-col items-center justify-center text-center transition duration-300 hover:scale-105 hover:shadow-glow"
              >
                <div className="font-bold text-teal-700 mb-1 text-base">{card.title}</div>
                <div className="text-sm text-gray-600 font-body">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
