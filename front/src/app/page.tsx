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

// Import form components (we'll create these)
import PersonalInfoForm from "./components/PersonalInfoForm"
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ProjectsForm from "./components/ProjectsForm"
import SkillsForm from "./components/SkillsForm"
import PreviewStep from "./components/PreviewStep"

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    experience: [],
    education: [],
    projects: [],
    skills: {}
  });

  const updateFormData = useCallback((section: string, data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, [section]: data }));
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
        return (
          <PreviewStep 
            data={formData} 
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
                <FileText className="w-7 h-7 text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ResumeGen</h1>
                <p className="text-gray-400">Professional Resume Builder</p>
              </div>
            </div>
            <div className="text-gray-400 font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12">
          {/* Progress Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-black/70 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-white mb-8">Progress</h2>
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`relative flex items-center space-x-4 p-4 rounded-2xl transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-gray-800/50 border border-gray-700'
                          : isCompleted
                          ? 'bg-gray-900/30 border border-gray-700/50'
                          : 'bg-gray-900/20 border border-gray-800 hover:bg-gray-900/30'
                      }`}
                      onClick={() => setCurrentStep(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Progress Line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute left-8 top-16 w-0.5 h-8 ${
                          isCompleted ? 'bg-gray-600' : 'bg-gray-800'
                        }`} />
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-gray-700 text-white shadow-lg'
                          : isCompleted
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-lg font-bold transition-colors ${
                          isActive ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-sm transition-colors ${
                          isActive ? 'text-gray-300' : isCompleted ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-4">
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400 text-xl lg:text-2xl">
                {steps[currentStep].description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
