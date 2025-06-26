"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Award, 
  Download,
  FileText
} from "lucide-react";

// Import form components
import PersonalInfoForm from "./components/PersonalInfoForm"
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ProjectsForm from "./components/ProjectsForm"
import SkillsForm from "./components/SkillsForm"
import PreviewStep from "./components/PreviewStep"
import LandingPage from "./components/LandingPage";

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: User,
    description: 'Basic details and contact information'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Professional experience and achievements'
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Educational background and qualifications'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderOpen,
    description: 'Notable projects and accomplishments'
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Award,
    description: 'Technical and soft skills'
  },
  {
    id: 'preview',
    title: 'Preview & Download',
    icon: Download,
    description: 'Review and download your resume'
  }
];

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    experience: [],
    education: [],
    projects: [],
    skills: {}
  });

  const handleCreateResume = () => {
    setShowForm(true);
  };

  const handleBackToHome = () => {
    setShowForm(false);
    setCurrentStep(0);
  };

  const updateFormData = useCallback((section: string, data: Record<string, any>) => {
    console.log(`Updating ${section} with data:`, data);
    setFormData(prev => {
      const updated = { ...prev, [section]: data };
      console.log(`Updated formData:`, updated);
      return updated;
    });
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoForm 
            data={formData.personal} 
            onUpdate={(data: Record<string, any>) => updateFormData('personal', data)}
            onNext={nextStep}
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            data={formData.experience} 
            onUpdate={(data: any[]) => updateFormData('experience', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'education':
        return (
          <EducationForm 
            data={formData.education} 
            onUpdate={(data: any[]) => updateFormData('education', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'projects':
        return (
          <ProjectsForm 
            data={formData.projects} 
            onUpdate={(data: any[]) => updateFormData('projects', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            data={formData.skills} 
            onUpdate={(data: Record<string, any>) => updateFormData('skills', data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'preview':
        // Debug: Log form data before transformation
        console.log('Form data before transformation:', formData);
        
        const transformedData = {
          // Personal info - access nested properties correctly
          name: formData.personal?.name || '',
          email: formData.personal?.email || '',
          location: formData.personal?.location || '',
          linkedin_url: formData.personal?.linkedin_url || '',
          github_url: formData.personal?.github_url || '',
          
          // Experience - map correctly and filter out empty ones
          experiences: Array.isArray(formData.experience) ? formData.experience.filter(exp => 
            (exp.title && exp.title.trim()) || (exp.company && exp.company.trim())
          ) : [],
          
          // Education - ensure proper structure and filter out empty ones
          education: Array.isArray(formData.education) ? formData.education.filter(edu => 
            (edu.institution && edu.institution.trim()) || (edu.degree && edu.degree.trim())
          ) : [],
          
          // Projects - handle description array properly and filter out empty ones
          projects: Array.isArray(formData.projects) ? formData.projects
            .filter(project => project.title && project.title.trim())
            .map((project: any) => ({
              title: project.title || '',
              descriptions: Array.isArray(project.description) 
                ? project.description.filter((desc: string) => desc && desc.trim())
                : []
            })) : [],
          
          // Skills - pass through as-is since it's already correct
          skills: formData.skills || {}
        };
        
        console.log('Transformed data:', transformedData);
        
        return (
          <PreviewStep 
            data={formData} 
            onPrev={prevStep}
            transformedData={transformedData}
          />
        );
      default:
        return null;
    }
  };

  if (!showForm) {
    return <LandingPage onCreateResume={handleCreateResume} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Back to Home Button */}
      <button 
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-xl border border-white/20 backdrop-blur-sm hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ResumeGen
                </h1>
                <p className="text-gray-600 font-medium">AI Resume Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Back to Landing
              </button>
              <div className="text-indigo-600 font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-xl border border-indigo-200">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Progress Bar */}
      <div className="bg-white/60 backdrop-blur-lg border-b border-gray-200/50 py-6">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`relative flex flex-col items-center cursor-pointer group ${
                      index <= currentStep ? 'opacity-100' : 'opacity-50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-indigo-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs transition-colors ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8">
        {/* Main Content */}
        <div className="mb-12">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {steps[currentStep].title}
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg lg:text-xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {steps[currentStep].description}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-3xl blur-3xl"></div>
            <div className="relative">
              {renderStepContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
