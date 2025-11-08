import React from 'react';
import { Brain, Target, Users, Zap, Shield, Award, Heart, Activity } from "lucide-react";

const AboutSection = () => {
  return (
    <section style={{ 
      padding: '6rem 2rem',
      backgroundColor: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          fontFamily: 'Poppins, sans-serif',
          background: 'linear-gradient(to right, hsl(180 75% 45%), hsl(195 85% 60%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
    }}>
      About MedAI Assist
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280', 
            maxWidth: '48rem', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Revolutionizing healthcare through artificial intelligence and machine learning to empower medical professionals worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div style={{
          border: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, hsl(180 75% 95%), hsl(195 85% 95%))',
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(to right, hsl(180 75% 45%), hsl(195 85% 60%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <Target style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Our Mission
            </h3>
          </div>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#374151', 
            lineHeight: '1.6'
          }}>
            At MedAI Assist, our mission is to empower healthcare professionals with cutting-edge AI technology
            that enables early disease detection and accurate diagnosis. We believe that by combining the expertise
            of medical professionals with advanced machine learning models, we can save lives and improve patient
            outcomes worldwide.
          </p>
        </div>

        {/* Technology Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: '#1f2937',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Our Technology
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Brain Card */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(to right, #f3e8ff, #e9d5ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Brain style={{ width: '2rem', height: '2rem', color: '#9333ea' }} />
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '0.75rem',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Advanced AI Models
                  </h4>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6',
                    fontSize: '1.125rem'
                  }}>
                    Our platform leverages state-of-the-art AI models, where specialized
                    algorithms are trained for specific medical imaging modalities and disease types. This approach
                    ensures the highest accuracy for each type of analysis, whether it's CT scans for lung cancer,
                    MRI for brain disorders, or histopathology for tissue analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Zap Card */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(to right, #fef3c7, #fed7aa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap style={{ width: '2rem', height: '2rem', color: '#ea580c' }} />
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '0.75rem',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Real-Time Processing
                  </h4>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6',
                    fontSize: '1.125rem'
                  }}>
                    Our optimized inference pipeline delivers results in seconds, not minutes. Medical professionals
                    can make faster decisions while maintaining the highest standards of diagnostic accuracy.
                  </p>
                </div>
              </div>
        </div>

            {/* Shield Card */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '2rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(to right, #d1fae5, #a7f3d0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Shield style={{ width: '2rem', height: '2rem', color: '#059669' }} />
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '0.75rem',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Security & Compliance
                  </h4>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6',
                    fontSize: '1.125rem'
                  }}>
                    We take patient privacy seriously. Our platform is HIPAA-compliant and uses enterprise-grade
                    encryption for all data in transit and at rest. All medical images are processed securely and
                    never used for training without explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Can Detect */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: '#1f2937',
            fontFamily: 'Poppins, sans-serif'
          }}>
            What We Can Detect
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                title: "Cancer Detection",
                items: ["Breast Cancer", "Colon Cancer", "Lung Cancer"],
                color: "linear-gradient(to right, #ef4444, #ec4899)",
                bgColor: "linear-gradient(to bottom right, #fef2f2, #fce7f3)"
              },
              {
                title: "Neurological Disorders",
                items: ["Alzheimer's Disease","Epilepsy", "Multiple Sclerosis"],
                color: "linear-gradient(to right, #8b5cf6, #6366f1)",
                bgColor: "linear-gradient(to bottom right, #faf5ff, #eef2ff)"
              },
            ].map((category, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '2rem',
                background: category.bgColor,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.5rem',
                    background: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Heart style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                  </div>
                  <h4 style={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.25rem', 
                    color: '#1f2937',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {category.title}
                  </h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {category.items.map((item, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      marginBottom: '0.75rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: category.color
                      }}></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: '#1f2937',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Benefits for Healthcare Professionals
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                icon: Award,
                title: "Improved Accuracy",
                description: "AI-assisted diagnosis reduces human error and improves detection rates by up to 40%.",
                color: "linear-gradient(to right, #f59e0b, #ea580c)",
                bgColor: "linear-gradient(to bottom right, #fffbeb, #fed7aa)"
    },
    {
      icon: Zap,
                title: "Time Savings",
                description: "Analyze images in seconds, allowing more time for patient care and consultation.",
                color: "linear-gradient(to right, #2563eb, #0891b2)",
                bgColor: "linear-gradient(to bottom right, #eff6ff, #ecfeff)"
    },
    {
      icon: Users,
                title: "Better Outcomes",
                description: "Early detection leads to better treatment options and significantly improved patient outcomes.",
                color: "linear-gradient(to right, #059669, #10b981)",
                bgColor: "linear-gradient(to bottom right, #ecfdf5, #d1fae5)"
              },
            ].map((benefit, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '2rem',
                background: benefit.bgColor,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '0.75rem',
                    background: benefit.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <benefit.icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                  </div>
                  <h4 style={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.25rem', 
                    color: '#1f2937',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {benefit.title}
                  </h4>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6'
                  }}>
                    {benefit.description}
          </p>
        </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
