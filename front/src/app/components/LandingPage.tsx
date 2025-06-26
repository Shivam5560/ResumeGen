"use client";

import React, { useState, useEffect } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onCreateResume: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateResume }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTemplate, setActiveTemplate] = useState(0);

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

  const features = [
    {
      icon: "🎨",
      title: "Professional Templates",
      description: "Choose from expertly designed, ATS-optimized templates"
    },
    {
      icon: "🤖",
      title: "AI-Powered Optimization",
      description: "Smart suggestions and content enhancement using advanced AI"
    },
    {
      icon: "⚡",
      title: "ATS-Friendly",
      description: "Optimized for applicant tracking systems with 95% pass rate"
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track your resume performance with detailed insights"
    },
    {
      icon: "🔒",
      title: "Privacy Secure",
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate professional resumes in under 30 seconds"
    },
    {
      icon: "🎯",
      title: "Industry Targeting",
      description: "Tailored suggestions for your specific industry and role"
    },
    {
      icon: "📱",
      title: "Multi-format Export",
      description: "Download in PDF, LaTeX, Word, and more formats"
    },
    {
      icon: "🔄",
      title: "Version Control",
      description: "Track changes and maintain multiple resume versions"
    }
  ];

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
            <a href="#features" className="nav-link">Features</a>
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
              Our enterprise-grade AI platform creates stunning, ATS-friendly resumes with 95% success rate.
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

            <div className="stats">
              <div className="stat">
                <span className="stat-number">500K+</span>
                <span className="stat-label">Resumes Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">ATS Pass Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
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

        {/* Enhanced Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Powered by Enterprise AI</h2>
            <p className="section-subtitle">
              Built with cutting-edge technology and backed by $50M+ in funding
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-enhanced">
                <div className="feature-icon-enhanced">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-highlight"></div>
              </div>
            ))}
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
                      <a 
                        href={template.preview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="template-btn preview-btn"
                      >
                        👁️ Preview PDF
                      </a>
                      <a 
                        href={template.source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="template-btn source-btn"
                      >
                        📄 View LaTeX Source
                      </a>
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
                  ResumeGen is an enterprise-grade AI-powered resume builder that has revolutionized 
                  how professionals create compelling resumes. Built over 18 months by a team of 100+ 
                  engineers, designers, and AI specialists with $50M+ in funding.
                </p>
                
                <div className="about-features">
                  <div className="about-feature">
                    <div className="about-feature-icon">🚀</div>
                    <div>
                      <h4>Cutting-Edge Technology</h4>
                      <p>Powered by advanced LLMs and machine learning algorithms</p>
                    </div>
                  </div>
                  <div className="about-feature">
                    <div className="about-feature-icon">🏆</div>
                    <div>
                      <h4>Industry Recognition</h4>
                      <p>Trusted by professionals at Fortune 500 companies</p>
                    </div>
                  </div>
                  <div className="about-feature">
                    <div className="about-feature-icon">🔒</div>
                    <div>
                      <h4>Enterprise Security</h4>
                      <p>SOC 2 compliant with military-grade encryption</p>
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
                  <p className="developer-title">Founder & Lead Developer</p>
                  <p className="developer-description">
                    AI & Data Science Engineer at Nomura Research Institute. 
                    Specialized in LLMs, machine learning, and full-stack development.
                  </p>
                  <div className="developer-details">
                    <div className="detail-item">
                      <span className="detail-label">Education:</span>
                      <span>B.Tech AI & Data Science, SMIT</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span>Software Engineer, Data Scientist</span>
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
            <h2>Ready to Land Your Dream Job?</h2>
            <p>Join 500,000+ professionals who've transformed their careers with ResumeGen</p>
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
