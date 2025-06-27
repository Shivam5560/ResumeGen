"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  Briefcase
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
    setExperienceList(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
    onUpdate(experienceList);
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
    setExperienceList(prev =>
      prev.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp, i) =>
                i === index ? value : resp
              )
            }
          : exp
      )
    );
    onUpdate(experienceList);
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
    <div className="space-y-6 w-full">
      {experienceList.map((experience, index) => (
        <motion.div
          key={experience.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-full"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-6 w-full">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Experience {index + 1}
                </h3>
              </div>
              {experienceList.length > 1 && (
                <button
                  onClick={() => removeExperience(experience.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Company *
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Employment Dates *
                </label>
                <input
                  type="text"
                  value={experience.dates}
                  onChange={(e) => updateExperience(experience.id, 'dates', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                  placeholder="e.g., Aug 2024 -- Present"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Key Responsibilities
                  </label>
                  <button
                    onClick={() => addResponsibility(experience.id)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
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
                        className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm min-h-[80px] resize-y"
                        placeholder="Describe your key responsibility or achievement..."
                      />
                      {experience.responsibilities.length > 1 && (
                        <button
                          onClick={() => removeResponsibility(experience.id, respIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors h-fit"
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
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Another Experience
        </button>
      </motion.div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200/50">
        <button
          onClick={() => onPrev(experienceList)}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>
        
        <button
          onClick={() => onNext(experienceList)}
          disabled={!isFormValid}
          className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
            isFormValid 
              ? 'hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
