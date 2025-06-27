"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Linkedin, Github } from "lucide-react";

interface PersonalInfoFormProps {
  data: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
  onNext: (data: Record<string, any>) => void;
}

export default function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
  const previousDataRef = useRef<string>('');
  
  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...data, [field]: value };
    const currentDataString = JSON.stringify(updatedData);
    
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onUpdate(updatedData);
    }
  };

  const handleNext = () => {
    onNext(data);
  };

  const isFormValid = data.name && data.email && data.location && data.linkedin_url && data.github_url;

  const formFields = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: User,
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      icon: Mail,
      required: true
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'City, State, Country',
      icon: MapPin,
      required: true
    },
    {
      id: 'linkedin_url',
      label: 'LinkedIn Profile',
      type: 'url',
      placeholder: 'https://linkedin.com/in/yourprofile',
      icon: Linkedin,
      required: true
    },
    {
      id: 'github_url',
      label: 'GitHub Profile',
      type: 'url',
      placeholder: 'https://github.com/yourusername',
      icon: Github,
      required: true
    }
  ];

  return (
    <div className="w-full h-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl overflow-hidden h-full"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              <p className="text-sm text-gray-600">Tell us about yourself to get started</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={field.id === 'name' ? 'lg:col-span-2' : ''}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={field.type}
                      value={data[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder={field.placeholder}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Form Completion</span>
              <span className="text-sm font-bold text-indigo-600">
                {Math.round((Object.values(data).filter(Boolean).length / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.values(data).filter(Boolean).length / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isFormValid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All fields completed
                </div>
              ) : (
                <span>Please fill in all required fields</span>
              )}
            </div>
            
            <motion.button
              onClick={handleNext}
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg ${
                isFormValid 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Experience
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={isFormValid ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
