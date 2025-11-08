import React from 'react';
import Navigation from '../components/Navigation';
import { Brain, Target, Microscope, BookOpen, Code, Database, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Research = () => {
  const navigate = useNavigate();

  const researchAreas = [
    {
      icon: Brain,
      title: "AI Technology",
      description: "Utilizing modern deep learning approaches to assist in medical image analysis and pattern detection",
      color: "from-primary to-secondary"
    },
    {
      icon: Microscope,
      title: "Medical Imaging",
      description: "Supporting various types of medical imaging modalities including X-rays, CT scans, and MRI images",
      color: "from-secondary to-accent"
    },
    {
      icon: Target,
      title: "Development Focus",
      description: "Project developed with focus on creating a helpful tool for medical image diagnostic assistance",
      color: "from-accent to-primary"
    },
    {
      icon: BookOpen,
      title: "Academic Project",
      description: "Developed as an educational and research project to explore AI applications in healthcare",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const technologies = [
    { icon: Code, name: "MERN Stack", description: "MongoDB, Express.js, React, Node.js" },
    { icon: Brain, name: "Machine Learning", description: "Deep learning for image analysis" },
    { icon: Database, name: "Data Storage", description: "Scalable data infrastructure" },
    { icon: Shield, name: "Security", description: "Data protection & encryption" }
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
          Research & Technology
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
          An academic project exploring AI applications in medical diagnostics
        </p>
      </div>

      {/* Research Areas */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {researchAreas.map((area, index) => {
            const AreaIcon = area.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-slate-200 shadow transition duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
              >
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(to right, ${area.color.split(' ')[1]}, ${area.color.split(' ')[2]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <AreaIcon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>

                <h3 
                  className="font-display"
                  style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.75rem',
                    color: '#0f172a'
                  }}
                >
                  {area.title}
                </h3>
                <p 
                  className="font-body"
                  style={{ 
                    fontSize: '1rem', 
                    color: '#64748b', 
                    lineHeight: '1.6'
                  }}
                >
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technologies Used */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem 4rem', background: 'white' }}>
        <h2 
          className="font-display"
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#0f172a'
          }}
        >
          Technologies Used
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          maxWidth: '80rem',
          margin: '0 auto'
        }}>
          {technologies.map((tech, index) => {
            const TechIcon = tech.icon;
            return (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(to bottom, #f0fdfa, #ffffff)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(to right, hsl(180, 75%, 45%), hsl(195, 65%, 55%))',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <TechIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h4 
                  className="font-display"
                  style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: '#0f172a'
                  }}
                >
                  {tech.name}
                </h4>
                <p 
                  className="font-body"
                  style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b'
                  }}
                >
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Research;
