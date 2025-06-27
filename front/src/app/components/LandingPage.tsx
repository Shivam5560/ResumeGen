"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

interface LandingPageProps {
  onCreateResume: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateResume }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Load resume count from localStorage only
    const savedCount = localStorage.getItem('resumeCreatedCount');
    if (savedCount) {
      setResumeCount(parseInt(savedCount, 10));
    }
  }, []);

  const incrementResumeCount = () => {
    const newCount = resumeCount + 1;
    setResumeCount(newCount);
    localStorage.setItem('resumeCreatedCount', newCount.toString());
  };

  const handlePdfPreview = (previewUrl: string) => {
    // Increment resume count for PDF download
    incrementResumeCount();
    
    // Open PDF in new tab
    window.open(previewUrl, '_blank', 'noopener noreferrer');
  };

  const handleLatexDownload = (sourceUrl: string) => {
    // Increment resume count for LaTeX download
    incrementResumeCount();
    
    // Open LaTeX source in new tab
    window.open(sourceUrl, '_blank', 'noopener noreferrer');
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const templates = [
    {
      id: 1,
      name: "Professional Tech Resume",
      description: "Perfect for software engineers and data scientists",
      preview: "/resources/Shivam-DataScientist.pdf",
      source: "/resources/sample.tex",
      author: "Shivam Sourav",
      category: "Technical"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="gradient-orb orb-1" style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}></div>
        <div className="gradient-orb orb-2" style={{
          transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
        }}></div>
        <div className="gradient-orb orb-3" style={{
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element element-1">📄</div>
        <div className="floating-element element-2">✨</div>
        <div className="floating-element element-3">🎯</div>
        <div className="floating-element element-4">💼</div>
        <div className="floating-element element-5">🚀</div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <div className="logo">
              <span className="logo-text">ResumeGen</span>
              <div className="logo-underline"></div>
            </div>
          </div>
          <nav className="nav">
            <a href="#templates" className="nav-link">Templates</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Craft Your Perfect</span>
              <span className="title-line highlight">Professional Resume</span>
              <span className="title-line">In Minutes</span>
            </h1>
            
            <p className="hero-subtitle">
              Transform your career story into a compelling resume that lands interviews. 
              Our AI-powered platform creates stunning, ATS-friendly resumes optimized for modern hiring systems.
            </p>

            <div className="cta-container">
              <button 
                className="cta-button primary"
                onClick={onCreateResume}
              >
                <span>Create Your Resume</span>
                <div className="button-glow"></div>
                <svg className="button-arrow" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              
              <a href="#templates" className="cta-button secondary">
                <span>View Templates</span>
              </a>
            </div>

            {/* Stats Section with real data */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
              >
                <motion.h3 
                  className="text-4xl font-bold text-indigo-600 mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  {resumeCount}+
                </motion.h3>
                <p className="text-gray-600 font-semibold">Resumes Created</p>
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
              >
                <motion.h3 
                  className="text-4xl font-bold text-purple-600 mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  95%+
                </motion.h3>
                <p className="text-gray-600 font-semibold">ATS Score</p>
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
              >
                <motion.h3 
                  className="text-4xl font-bold text-green-600 mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                >
                  2min
                </motion.h3>
                <p className="text-gray-600 font-semibold">Average Time</p>
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="hero-visual">
            <div className="resume-mockup">
              <div className="mockup-container">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-line long"></div>
                  <div className="mockup-line medium"></div>
                  <div className="mockup-line short"></div>
                  <div className="mockup-section">
                    <div className="mockup-line medium"></div>
                    <div className="mockup-line long"></div>
                    <div className="mockup-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="templates-section">
          <div className="section-header">
            <h2 className="section-title">Professional Templates</h2>
            <p className="section-subtitle">
              Hand-crafted by industry experts and tested with top companies
            </p>
          </div>

          <div className="templates-showcase">
            {templates.map((template, index) => (
              <div 
                key={template.id} 
                className={`template-card ${activeTemplate === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveTemplate(index)}
              >
                <div className="template-preview">
                  <iframe 
                    src={template.preview}
                    title={template.name}
                    className="template-iframe"
                  />
                  <div className="template-overlay">
                    <div className="template-actions">
                      <button 
                        onClick={() => handlePdfPreview(template.preview)}
                        className="template-btn preview-btn"
                      >
                        👁️ Preview PDF
                      </button>
                      <button 
                        onClick={() => handleLatexDownload(template.source)}
                        className="template-btn source-btn"
                      >
                        📄 View LaTeX Source
                      </button>
                    </div>
                  </div>
                </div>
                <div className="template-info">
                  <div className="template-badge">{template.category}</div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <div className="template-author">
                    <span>Created by: {template.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-container">
            <div className="about-content">
              <div className="about-text">
                <h2 className="section-title">About ResumeGen</h2>
                <p className="about-description">
                  ResumeGen is an AI-powered resume builder designed to help professionals create 
                  compelling, ATS-optimized resumes. Our platform combines modern technology with 
                  best practices in resume writing to help you stand out in today&apos;s competitive job market.
                </p>
                
                <div className="about-features">
                  <div className="about-feature">
                    <div className="about-feature-icon">🚀</div>
                    <div>
                      <h4>Modern Technology</h4>
                      <p>Built with React, Next.js, and modern AI integration</p>
                    </div>
                  </div>
                  <div className="about-feature">
                    <div className="about-feature-icon">🏆</div>
                    <div>
                      <h4>ATS Optimized</h4>
                      <p>Resumes designed to pass Applicant Tracking Systems</p>
                    </div>
                  </div>
                  <div className="about-feature">
                    <div className="about-feature-icon">🔒</div>
                    <div>
                      <h4>Privacy First</h4>
                      <p>Your data is secure and never shared with third parties</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="developer-card">
                <div className="developer-avatar">
                  <div className="avatar-placeholder">SS</div>
                </div>
                <div className="developer-info">
                  <h3>Shivam Sourav</h3>
                  <p className="developer-title">Developer & Creator</p>
                  <p className="developer-description">
                    AI & Data Science Engineer passionate about creating tools that help 
                    professionals advance their careers through better resume presentation.
                  </p>
                  <div className="developer-details">
                    <div className="detail-item">
                      <span className="detail-label">Education:</span>
                      <span>B.Tech AI & Data Science, SMIT</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Specialization:</span>
                      <span>AI, Machine Learning, Full-stack Development</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span>Banka, Bihar, India</span>
                    </div>
                  </div>
                  <div className="developer-links">
                    <a 
                      href="https://www.linkedin.com/in/shivam-sourav-b889aa204/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="https://github.com/Shivam5560" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link github"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Create Your Professional Resume?</h2>
            <p>Join professionals who&apos;ve improved their job applications with ResumeGen</p>
            <button 
              className="cta-button primary large"
              onClick={onCreateResume}
            >
              <span>Start Building Now</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </section>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </div>
  );
};

export default LandingPage;
