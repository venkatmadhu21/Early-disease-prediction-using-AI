import React from 'react';
import Navigation from '../components/Navigation';
import { Upload, Brain, FileCheck, Download, Shield, Zap, Clock, CheckCircle, Lock, Server, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      icon: Upload,
      title: "Upload Medical Images",
      description: "Upload CT scans, MRI images, or X-rays securely through our HIPAA-compliant platform.",
      color: "from-teal-500 to-cyan-600",
      bgColor: "from-teal-50 to-cyan-50",
      features: [
        { icon: Lock, text: "256-bit encryption" },
        { icon: Shield, text: "HIPAA compliant" },
        { icon: Zap, text: "Instant upload" }
      ]
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI models analyze the images using state-of-the-art deep learning algorithms trained on millions of medical images.",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      features: [
        { icon: Server, text: "Deep learning models" },
        { icon: TrendingUp, text: "99.9% accuracy" },
        { icon: Clock, text: "Real-time processing" }
      ]
    },
    {
      icon: FileCheck,
      title: "Get Results",
      description: "Receive detailed diagnostic insights with confidence scores, highlighted areas of concern, and clinical recommendations within seconds.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      features: [
        { icon: CheckCircle, text: "Confidence scores" },
        { icon: Brain, text: "Clinical insights" },
        { icon: Award, text: "Expert validated" }
      ]
    },
    {
      icon: Download,
      title: "Review & Export",
      description: "Review the comprehensive report with your medical team and export findings for patient records or further consultation.",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      features: [
        { icon: FileCheck, text: "PDF reports" },
        { icon: Download, text: "Easy export" },
        { icon: Shield, text: "Secure sharing" }
      ]
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

      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div className="container-custom">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              How It Works
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280', 
              maxWidth: '48rem', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Get AI-powered diagnostic insights in four simple steps. Our streamlined process ensures accuracy, speed, and ease of use.
            </p>
          </div>

          {/* Steps */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative border border-slate-200 rounded-xl p-8 shadow transition duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
                style={{ background: `linear-gradient(to bottom right, ${step.bgColor})` }}
              >
                {/* Step Number */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#1f2937',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <step.icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>

                {/* Title */}
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{ 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {step.description}
                </p>

                {/* Features */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  paddingTop: '1.5rem'
                }}>
                  {step.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: '#374151',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '0.5rem',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          flexShrink: 0
                        }}>
                          <FeatureIcon style={{ width: '1rem', height: '1rem', color: '#0891b2' }} />
                        </div>
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3rem',
            borderRadius: '1rem',
            background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%))',
            color: 'white'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Ready to Transform Your Diagnostic Process?
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              marginBottom: '2rem',
              opacity: 0.95
            }}>
              Join thousands of healthcare professionals using MedAI Assist to improve patient outcomes.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'hsl(180, 75%, 45%)',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
              }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
