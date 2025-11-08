import React, { useEffect, useRef } from 'react';
import { Activity, Brain, Dna, Heart, Microscope, Pill, Stethoscope } from 'lucide-react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // Create gentle, sparse particles to match subtle background
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.35 + 0.12,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(45, 199, 180, ${particle.opacity})`;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

  // Wrap around edges for a softer effect
  if (particle.x < -50) particle.x = canvas.width + 50;
  if (particle.x > canvas.width + 50) particle.x = -50;
  if (particle.y < -50) particle.y = canvas.height + 50;
  if (particle.y > canvas.height + 50) particle.y = -50;
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const medicalIcons = [
    { Icon: Brain, delay: 0, position: 'top-6 left-12' },
    { Icon: Dna, delay: 0.6, position: 'top-20 right-10' },
    { Icon: Heart, delay: 1.2, position: 'top-28 left-1/4' },
    { Icon: Activity, delay: 0.4, position: 'bottom-24 right-1/4' },
    { Icon: Microscope, delay: 0.9, position: 'bottom-12 left-20' },
    { Icon: Stethoscope, delay: 1.6, position: 'top-1/3 right-14' },
    { Icon: Pill, delay: 2.2, position: 'bottom-1/3 left-1/3' },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/30 to-cyan-50/50" />

  {/* Canvas for particles */}
  <canvas ref={canvasRef} className="absolute inset-0 animated-canvas" />

      {/* Floating Medical Icons */}
      {medicalIcons.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className={`absolute ${position} opacity-20 animate-float`}
          style={{ animationDelay: `${delay}s` }}
        >
          <Icon className="w-16 h-16 text-medical-teal" />
        </div>
      ))}

      {/* DNA Helix */}
      <div className="absolute top-1/4 right-1/3 w-40 h-40 animate-rotate-slow" style={{opacity: 0.22}}>
        <Dna className="w-full h-full text-medical-cyan" />
      </div>

      {/* Large centered glowing orb behind hero */}
      <div className="absolute inset-x-0 top-28 flex justify-center pointer-events-none">
        <div
          className="w-[520px] h-[520px] rounded-full blur-4xl transform translate-y-6"
          style={{ backgroundColor: 'rgba(25,198,178,0.22)' }}
        />
      </div>

      {/* Glowing orbs */}
      <div
        className="absolute top-1/3 left-1/6 w-72 h-72 rounded-full blur-3xl animate-pulse-glow"
        style={{ backgroundColor: 'rgba(25,198,178,0.18)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
        style={{ backgroundColor: 'rgba(38,180,160,0.16)', animationDelay: '1.2s' }}
      />
    </div>
  );
};

export default AnimatedBackground;
