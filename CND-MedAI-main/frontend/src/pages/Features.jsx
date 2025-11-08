import React from 'react';
import Navigation from '../components/Navigation';
import { Brain, Shield, Zap, Users, Clock, Globe, Award, Lock, TrendingUp, CheckCircle, Activity, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Deep learning technology to assist in analyzing medical images and identifying potential areas of concern",
      color: "from-primary to-secondary",
      highlights: ["Deep learning models", "Pattern recognition", "Automated analysis"]
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Built with security best practices to help protect sensitive medical information",
      color: "from-secondary to-accent",
      highlights: ["Data encryption", "Secure storage", "Access controls"]
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Quick image processing to help healthcare professionals get results efficiently",
      color: "from-accent to-primary",
      highlights: ["Quick analysis", "Efficient workflow", "Fast results"]
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Intuitive design that makes it easy for medical professionals to upload and review diagnostic images",
      color: "from-purple-500 to-pink-500",
      highlights: ["Easy upload", "Clear reports", "Simple navigation"]
    },
    {
      icon: Clock,
      title: "Available Anytime",
      description: "Cloud-based platform accessible when you need it for diagnostic assistance",
      color: "from-orange-500 to-red-500",
      highlights: ["Cloud access", "Flexible usage", "Remote access"]
    },
    {
      icon: Award,
      title: "Quality Results",
      description: "Designed to provide consistent and reliable diagnostic assistance for medical imaging",
      color: "from-blue-500 to-indigo-500",
      highlights: ["Consistent output", "Reliable analysis", "Quality checks"]
    },
    {
      icon: Lock,
      title: "Privacy Focused",
      description: "Platform designed with patient privacy and data protection as core principles",
      color: "from-gray-600 to-gray-800",
      highlights: ["Privacy by design", "Data protection", "Secure handling"]
    },
    {
      icon: Activity,
      title: "Upload History",
      description: "Track and review previously uploaded images and their diagnostic results",
      color: "from-pink-500 to-rose-500",
      highlights: ["History tracking", "Easy review", "Report access"]
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Access the platform from various devices with a responsive web interface",
      color: "from-indigo-500 to-purple-500",
      highlights: ["Web-based", "Device friendly", "Responsive layout"]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdfa, #ffffff)' }}>
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

      {/* Header */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <h1 
          className="font-display"
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%), hsl(180, 80%, 55%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Platform Features
        </h1>
        <p 
          className="font-body"
          style={{ 
            fontSize: '1.25rem', 
            textAlign: 'center', 
            color: '#64748b',
            maxWidth: '48rem',
            margin: '0 auto'
          }}
        >
          Explore the key features of our AI-powered medical imaging analysis platform
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow transition duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
              >
                {/* Icon */}
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[2]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <FeatureIcon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>

                {/* Content */}
                <h3 
                  className="font-display"
                  style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.75rem',
                    color: '#0f172a'
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="font-body"
                  style={{ 
                    fontSize: '1rem', 
                    color: '#64748b', 
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}
                >
                  {feature.description}
                </p>

                {/* Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {feature.highlights.map((highlight, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#475569'
                      }}
                    >
                      <CheckCircle style={{ width: '1rem', height: '1rem', color: '#0891b2' }} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
