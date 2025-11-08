import React from 'react';
import Navigation from '../components/Navigation';
import AboutSection from '../components/AboutSection';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: 'white', minHeight: '100vh' }}>
      <Navigation />
      
      {/* Back to Home Button */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem', paddingTop: '6rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%))',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Reuse the exact same About content as homepage */}
      <AboutSection />
    </div>
  );
};

export default AboutUs;