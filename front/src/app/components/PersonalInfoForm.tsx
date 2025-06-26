"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface PersonalInfoFormProps {
  data: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
  onNext: () => void;
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

  const isFormValid = data.name && data.email && data.location && data.linkedin_url && data.github_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Location *
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="City, State, Country"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            LinkedIn Profile *
          </label>
          <input
            type="url"
            value={data.linkedin_url || ''}
            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            GitHub Profile *
          </label>
          <input
            type="url"
            value={data.github_url || ''}
            onChange={(e) => handleInputChange('github_url', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Professional Summary
          </label>
          <textarea
            value={data.summary || ''}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm min-h-[120px] resize-y"
            placeholder="Write a brief professional summary..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
            isFormValid 
              ? 'hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Next Step
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
