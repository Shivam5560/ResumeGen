"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Award, 
  Download,
  FileText,
  Sparkles,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";

// Import form components
import PersonalInfoForm from "./components/PersonalInfoForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ProjectsForm from "./components/ProjectsForm";
import SkillsForm from "./components/SkillsForm";
import PreviewStep from "./components/PreviewStep";
import LandingPage from "./components/LandingPage";
import LivePreviewComponent from "./components/LivePreviewComponent";

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: User,
    description: 'Basic details and contact information',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    accent: 'blue'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Professional experience and achievements',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    accent: 'purple'
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Educational background and qualifications',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    accent: 'green'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderOpen,
    description: 'Notable projects and accomplishments',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    accent: 'orange'
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Award,
    description: 'Technical and soft skills',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50',
    accent: 'indigo'
  },
  {
    id: 'preview',
    title: 'Preview & Download',
    icon: Download,
    description: 'Review and download your resume',
    color: 'from-teal-500 to-blue-500',
    bgColor: 'from-teal-50 to-blue-50',
    accent: 'teal'
  }
];

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  })
};

// Add this function to test connectivity
const testApiConnection = async () => {
  try {
    const response = await fetch('/api/health');
    const result = await response.json();
    console.log('API Health Check:', result);
    return result;
  } catch (error) {
    console.error('API connection test failed:', error);
    return null;
  }
};

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    personal: {},
    experience: [],
    education: [],
    projects: [],
    skills: {}
  });

  // Enhanced spring animations for progress
  const progress = useSpring((currentStep + 1) / steps.length, {
    stiffness: 300,
    damping: 30
  });
  
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  const handleCreateResume = () => {
    setShowForm(true);
  };

  const handleBackToHome = () => {
    setShowForm(false);
    setCurrentStep(0);
    setDirection(0);
  };

  const updateFormData = useCallback((section: string, data: Record<string, any> | any[]) => {
    console.log(`Updating ${section} data:`, data); // Debug log
    setFormData(prev => {
      const updated = { ...prev, [section]: data };
      console.log('Updated formData:', updated); // Debug log
      return updated;
    });
  }, []);

  const validateStep = (stepData: Record<string, any>): boolean => {
    return true;
  };

  const handleStepSubmit = (stepData: Record<string, any>) => {
    if (validateStep(stepData)) {
      updateStepData(steps[currentStep].id, stepData);
      nextStep();
    }
  };

  const updateStepData = (step: string, stepData: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      [step]: stepData
    }));
  };

  const handleNext = (stepData: Record<string, any>) => {
    if (validateStep(stepData)) {
      updateStepData(steps[currentStep].id, stepData);
      nextStep();
    }
  };

  const handlePrev = (stepData: Record<string, any>) => {
    updateStepData(steps[currentStep].id, stepData);
    prevStep();
  };

  const getFormattedData = (): Record<string, any> => {
    return {
      ...formData,
      formatted: true
    };
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex !== currentStep && !isAnimating) {
      setIsAnimating(true);
      setDirection(stepIndex > currentStep ? 1 : -1);
      setCurrentStep(stepIndex);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoForm 
            data={formData.personal} 
            onUpdate={(data: Record<string, any>) => updateFormData('personal', data)}
            onNext={handleNext}
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            data={formData.experience} 
            onUpdate={(data: any[]) => updateFormData('experience', data)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'education':
        return (
          <EducationForm 
            data={formData.education} 
            onUpdate={(data: any[]) => updateFormData('education', data)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'projects':
        return (
          <ProjectsForm 
            data={formData.projects} 
            onUpdate={(data: any[]) => {
              console.log('Projects onUpdate called with:', data); // Debug log
              updateFormData('projects', data);
            }}
            onNext={() => {
              console.log('Projects onNext - current formData:', formData); // Debug log
              nextStep();
            }}
            onPrev={() => {
              console.log('Projects onPrev - current formData:', formData); // Debug log
              prevStep();
            }}
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            data={formData.skills} 
            onUpdate={(data: Record<string, any>) => updateFormData('skills', data)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'preview':
        const transformedData = getFormattedData();
        
        return (
          <PreviewStep 
            data={formData} 
            onPrev={handlePrev}
            transformedData={transformedData}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Test API connection on page load
    testApiConnection();
  }, []);

  if (!showForm) {
    return <LandingPage onCreateResume={handleCreateResume} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Logo Fixed in Top Right Corner of Screen */}
      <motion.div 
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Premium Logo */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-75 blur-sm"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-white/50">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <motion.div 
                className="absolute w-5 h-6 bg-white rounded-sm opacity-90"
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-0.5">
                <div className="w-3 h-0.5 bg-indigo-600 rounded-full"></div>
                <div className="w-2.5 h-0.5 bg-purple-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-pink-600 rounded-full"></div>
              </div>
              
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-1.5 h-1.5 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <div className="text-right">
          <motion.div 
            className="text-lg font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ResumeGen
          </motion.div>
          <motion.div 
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            AI Resume Builder
          </motion.div>
          <motion.div 
            className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 400 }}
          >
            <Shield className="w-2.5 h-2.5" />
            PRO
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Back to Home Button with micro-animations */}
      <motion.button 
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 group bg-white/90 backdrop-blur-xl hover:bg-white text-gray-700 hover:text-indigo-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-2xl border border-white/50"
        whileHover={{ 
          scale: 1.05,
          y: -2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div 
          className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"
          whileHover={{ rotate: 12 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.svg 
            className="w-4 h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            whileHover={{ x: -2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </motion.svg>
        </motion.div>
        <span className="hidden sm:block">Back to Home</span>
      </motion.button>

      {/* Enhanced Horizontal Progress Bar - Complete UI with all icons visible */}
      <motion.div 
        className="relative z-30 bg-white/70 backdrop-blur-xl border-b border-white/30 py-4 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            {/* Complete Progress Steps - All Icons Visible */}
            <div className="flex items-center justify-center flex-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`relative flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                        index <= currentStep ? 'opacity-100' : 'opacity-50'
                      }`}
                      onClick={() => jumpToStep(index)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: index <= currentStep ? 1 : 0.5, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Step Circle - Consistent Size */}
                      <div className="relative">
                        {(isActive || isCompleted) && (
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-lg opacity-40`}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                        <motion.div 
                          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                            isActive
                              ? `bg-gradient-to-br ${step.color} border-white text-white shadow-2xl`
                              : isCompleted
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-white text-white shadow-xl'
                              : 'bg-white border-gray-300 text-gray-500 group-hover:border-gray-400 shadow-lg'
                          }`}
                          whileHover={{
                            scale: 1.1,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                          }}
                        >
                          <Icon className="w-7 h-7" />
                          {isCompleted && !isActive && (
                            <motion.div 
                              className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      
                      {/* Step Text */}
                      <motion.div 
                        className="mt-3 text-center w-28"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <div 
                          className={`text-sm font-bold transition-colors leading-tight ${
                            isActive 
                              ? 'text-indigo-900' 
                              : isCompleted 
                              ? 'text-emerald-800' 
                              : 'text-gray-600'
                          }`}
                        >
                          {step.title}
                        </div>
                      </motion.div>
                    </motion.div>
                    
                    {/* Connection Line Between Steps */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 flex items-center justify-center mx-6">
                        <div className="relative w-24 h-1">
                          <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
                          <motion.div 
                            className={`absolute inset-0 rounded-full ${
                              index < currentStep 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                                : 'bg-gray-300'
                            }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: index < currentStep ? 1 : 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            style={{ transformOrigin: 'left' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Fixed spacing */}
      {steps[currentStep].id === 'preview' ? (
        // Full screen preview for final step
        <motion.div 
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 text-center">
            <motion.h2 
              className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {steps[currentStep].title}
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {steps[currentStep].description}
            </motion.p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 via-purple-100/30 to-blue-100/30 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : (
        // Enhanced Split view with proper spacing
        <div className="relative z-20 flex h-[calc(100vh-150px)] w-full mt-4">
          {/* Left side - Form (65%) */}
          <motion.div 
            className="w-[65%] flex flex-col"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="w-full max-w-none">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="w-full"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right side - Live Preview (35%) - Fixed spacing and centered title */}
          <motion.div 
            className="w-[35%] bg-gradient-to-br from-gray-50/95 to-gray-100/95 backdrop-blur-xl border-l border-gray-200/50 shadow-xl"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Fixed Preview Header - Centered title */}
              <motion.div 
                className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.98)" }}
              >
                {/* Centered Live Preview Title */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Live Preview</h3>
                  </div>
                  <p className="text-gray-600 text-xs font-medium">Real-time updates</p>
                  
                  {/* Live indicator */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-emerald-700 text-xs font-semibold">Live</span>
                  </div>
                </div>
                
                {/* Compact Progress indicator */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-700">Progress</span>
                    <motion.span 
                      className="text-xs font-bold text-indigo-600"
                      key={currentStep}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner relative">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full shadow-sm"
                      style={{ width: progressWidth }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Step {currentStep + 1} of {steps.length} • {steps[currentStep].title}
                  </p>
                </motion.div>
              </motion.div>
              
              {/* Fixed Preview Content - Static white colors only */}
              <motion.div 
                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
                key={`preview-${currentStep}`}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="bg-white/98 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 min-h-[calc(100vh-360px)]"
                >
                  <LivePreviewComponent data={formData} />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 4px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5, #7c3aed);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #4338ca, #6d28d9);
        }
      `}</style>
    </div>
  );
}
