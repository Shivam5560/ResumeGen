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

// Add this function to test API connectivity
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

  const updateFormData = useCallback((section: string, data: Record<string, any>) => {
    setFormData(prev => {
      const updated = { ...prev, [section]: data };
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
            onUpdate={(data: any[]) => updateFormData('projects', data)}
            onNext={handleNext}
            onPrev={handlePrev}
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
      {/* Enhanced Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

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

      {/* Enhanced Header with more sophisticated animations */}
      <motion.header 
        className="relative z-40 bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <motion.div 
            className="flex flex-col items-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Logo Section with particles */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              <div className="relative group">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FileText className="w-8 h-8 text-white" />
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-2 h-2 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.h1 
                  className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ResumeGen
                </motion.h1>
                <motion.div 
                  className="flex items-center justify-center gap-2 mt-2"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                  <p className="text-gray-600 font-semibold text-sm">Enterprise AI Resume Builder</p>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Progress indicator with interactive elements */}
            <motion.div 
              className="bg-white/60 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/30 shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-600">Progress:</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
                      style={{ width: progressWidth }}
                      initial={{ width: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <motion.div
                        className="absolute right-0 top-0 w-full h-full bg-white/30 rounded-full"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                  </div>
                  <motion.span 
                    className="text-sm font-bold text-indigo-600 min-w-[3rem]"
                    key={currentStep}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Enhanced Horizontal Progress Bar with more interactions */}
      <motion.div 
        className="relative z-30 bg-white/40 backdrop-blur-xl border-b border-white/20 py-8 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center relative">
                  <motion.div
                    className={`relative flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                      index <= currentStep ? 'opacity-100' : 'opacity-40'
                    }`}
                    onClick={() => jumpToStep(index)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: index <= currentStep ? 1 : 0.4, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Enhanced Step Circle */}
                    <div className="relative">
                      {(isActive || isCompleted) && (
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-lg opacity-50`}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      <motion.div 
                        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                          isActive
                            ? `bg-gradient-to-br ${step.color} border-white text-white shadow-2xl`
                            : isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-white text-white shadow-xl'
                            : 'bg-white/90 border-gray-200 text-gray-400 group-hover:border-gray-300 shadow-lg'
                        }`}
                        whileHover={{
                          rotate: isActive ? 0 : 5,
                          scale: 1.1
                        }}
                        animate={isActive ? {
                          boxShadow: [
                            "0 0 20px rgba(99, 102, 241, 0.3)",
                            "0 0 40px rgba(99, 102, 241, 0.5)",
                            "0 0 20px rgba(99, 102, 241, 0.3)"
                          ]
                        } : {}}
                        transition={{
                          boxShadow: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <motion.div
                          animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        {isCompleted && !isActive && (
                          <motion.div 
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <motion.svg 
                              className="w-3 h-3 text-white" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Enhanced Step Info */}
                    <motion.div 
                      className="mt-3 text-center max-w-[120px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <motion.div 
                        className={`text-sm font-bold transition-colors ${
                          isActive ? 'text-indigo-700' : isCompleted ? 'text-emerald-700' : 'text-gray-500'
                        }`}
                        animate={isActive ? { 
                          color: ["#3730a3", "#7c3aed", "#3730a3"]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {step.title}
                      </motion.div>
                      <div className={`text-xs mt-1 transition-colors ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </motion.div>

                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
                      initial={{ y: 10, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                    >
                      Click to jump to this step
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Enhanced Connection Line with flowing animation */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 relative">
                      <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                      <motion.div 
                        className={`absolute inset-0 rounded-full overflow-hidden ${
                          index < currentStep 
                            ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                            : 'bg-gray-200'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: index < currentStep ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ transformOrigin: 'left' }}
                      >
                        {index < currentStep && (
                          <motion.div
                            className="w-full h-full bg-white/30"
                            animate={{
                              x: ['-100%', '100%']
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area with enhanced animations */}
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
        // Enhanced Split view with better animations
        <div className="relative z-20 flex h-[calc(100vh-280px)] w-full">
          {/* Left side - Form (60%) */}
          <motion.div 
            className="w-[60%] flex flex-col"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="w-full max-w-none">
                <motion.div 
                  className="mb-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2 
                    className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent"
                    variants={itemVariants}
                  >
                    {steps[currentStep].title}
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 text-xl font-medium leading-relaxed"
                    variants={itemVariants}
                  >
                    {steps[currentStep].description}
                  </motion.p>
                </motion.div>

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

          {/* Enhanced Right side - Live Preview (40%) */}
          <motion.div 
            className="w-[40%] bg-gradient-to-br from-gray-50/90 to-gray-100/90 backdrop-blur-xl border-l-2 border-indigo-200 shadow-2xl"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          >
            <div className="h-full flex flex-col">
              {/* Enhanced Preview Header with live progress connection */}
              <motion.div 
                className="p-6 bg-white/90 backdrop-blur-xl border-b border-white/30 shadow-lg"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Live Preview</h3>
                      <p className="text-gray-600 text-sm font-medium">Real-time resume builder</p>
                    </div>
                  </div>
                  <motion.div 
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 px-3 py-1 rounded-full border border-emerald-200"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.3)",
                        "0 0 0 4px rgba(34, 197, 94, 0.1)",
                        "0 0 0 0 rgba(34, 197, 94, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-emerald-700 text-xs font-semibold">Live</span>
                  </motion.div>
                </div>
                
                {/* Enhanced Progress indicator with step connection */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Completion</span>
                    <motion.span 
                      className="text-sm font-bold text-indigo-600"
                      key={currentStep}
                      initial={{ scale: 1.2, color: "#7c3aed" }}
                      animate={{ scale: 1, color: "#3730a3" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner relative">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full shadow-lg relative overflow-hidden"
                      style={{ width: progressWidth }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                    <motion.div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <TrendingUp className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  <motion.p 
                    className="text-xs text-gray-500 mt-2"
                    animate={{
                      color: steps[currentStep].accent === 'blue' ? '#3b82f6' : 
                             steps[currentStep].accent === 'purple' ? '#8b5cf6' :
                             steps[currentStep].accent === 'green' ? '#10b981' : '#6b7280'
                    }}
                  >
                    Step {currentStep + 1} of {steps.length} • {steps[currentStep].title}
                  </motion.p>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Preview Content with step-based highlighting */}
              <motion.div 
                className="flex-1 overflow-y-auto p-6 custom-scrollbar"
                key={`preview-${currentStep}`}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 min-h-full transition-all duration-500 bg-gradient-to-br ${steps[currentStep].bgColor}`}
                  animate={{
                    borderColor: currentStep === 0 ? '#3b82f6' :
                                currentStep === 1 ? '#8b5cf6' :
                                currentStep === 2 ? '#10b981' :
                                currentStep === 3 ? '#f97316' :
                                currentStep === 4 ? '#6366f1' : '#14b8a6'
                  }}
                  transition={{ duration: 0.5 }}
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
