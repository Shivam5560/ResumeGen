"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  Briefcase,
  Building,
  Calendar,
  MapPin
} from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  location: string;
  responsibilities: string[];
}

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
  onNext: (stepData: Experience[]) => void;
  onPrev: (stepData: Experience[]) => void;
}

export default function ExperienceForm({ data, onUpdate, onNext, onPrev }: ExperienceFormProps) {
  const [experienceList, setExperienceList] = useState<Experience[]>(
    data.length > 0 ? data : [{
      id: '1',
      title: "",
      company: "",
      dates: "",
      location: "",
      responsibilities: [""]
    }]
  );

  useEffect(() => {
    onUpdate(experienceList);
  }, [experienceList, onUpdate]);

  const addExperience = () => {
    setExperienceList(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: "",
        company: "",
        dates: "",
        location: "",
        responsibilities: [""]
      }
    ]);
  };

  const removeExperience = (id: string) => {
    setExperienceList(prev => prev.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
    const updatedList = experienceList.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperienceList(updatedList);
  };

  const addResponsibility = (id: string) => {
    setExperienceList(prev =>
      prev.map(exp =>
        exp.id === id 
          ? { ...exp, responsibilities: [...exp.responsibilities, ""] }
          : exp
      )
    );
  };

  const updateResponsibility = (expId: string, index: number, value: string) => {
    const updatedList = experienceList.map(exp =>
      exp.id === expId
        ? {
            ...exp,
            responsibilities: exp.responsibilities.map((resp, i) =>
              i === index ? value : resp
            )
          }
        : exp
    );
    setExperienceList(updatedList);
  };

  const removeResponsibility = (expId: string, index: number) => {
    setExperienceList(prev =>
      prev.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter((_, i) => i !== index)
            }
          : exp
      )
    );
  };

  const isFormValid = experienceList.every(exp =>
    exp.title.trim() && exp.company.trim() && exp.dates.trim() && exp.location.trim() &&
    exp.responsibilities.some(resp => resp.trim())
  );

  return (
    <div className="w-full h-full p-4">
      <div className="space-y-6 h-full overflow-y-auto">
        {experienceList.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Experience {index + 1}</h3>
                    <p className="text-sm text-gray-600">Professional work experience</p>
                  </div>
                </div>
                {experienceList.length > 1 && (
                  <button
                    onClick={() => removeExperience(experience.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={experience.title}
                      onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., Tech Corp Inc."
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Dates <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={experience.dates}
                      onChange={(e) => updateExperience(experience.id, 'dates', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., Aug 2024 -- Present"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={experience.location}
                      onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </motion.div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Key Responsibilities
                    </label>
                    <button
                      onClick={() => addResponsibility(experience.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Add Responsibility
                    </button>
                  </div>

                  <div className="space-y-3">
                    {experience.responsibilities.map((responsibility, respIndex) => (
                      <div key={respIndex} className="flex gap-3">
                        <textarea
                          value={responsibility}
                          onChange={(e) => updateResponsibility(experience.id, respIndex, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 min-h-[80px] resize-y placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                          placeholder="Describe your key responsibility or achievement..."
                        />
                        {experience.responsibilities.length > 1 && (
                          <button
                            onClick={() => removeResponsibility(experience.id, respIndex)}
                            className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors h-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: experienceList.length * 0.1 }}
          className="flex justify-center"
        >
          <button
            onClick={addExperience}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Another Experience
          </button>
        </motion.div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              onUpdate(experienceList);
              onPrev(experienceList);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            {isFormValid ? (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                All experiences completed
              </div>
            ) : (
              <span>Please complete all required fields</span>
            )}
          </div>
          
          <motion.button
            onClick={() => {
              onUpdate(experienceList);
              onNext(experienceList);
            }}
            disabled={!isFormValid}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg ${
              isFormValid 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Education
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
