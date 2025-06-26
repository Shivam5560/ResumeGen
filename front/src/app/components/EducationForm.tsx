"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  GraduationCap
} from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  gpa: string;
  graduation_date: string;
}

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function EducationForm({ data, onUpdate, onNext, onPrev }: EducationFormProps) {
  const [educationList, setEducationList] = useState<Education[]>(
    data.length > 0 ? data : [{
      id: '1',
      institution: "",
      degree: "",
      gpa: "",
      graduation_date: ""
    }]
  );

  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        institution: "",
        degree: "",
        gpa: "",
        graduation_date: ""
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducationList((prev) => prev.filter((education) => education.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducationList((prev) =>
      prev.map((education) =>
        education.id === id ? { ...education, [field]: value } : education
      )
    );
  };

  const isFormValid = educationList.every(
    (education) =>
      education.institution.trim() &&
      education.degree.trim() &&
      education.graduation_date.trim()
  );

  useEffect(() => {
    onUpdate(educationList);
  }, [educationList, onUpdate]);

  return (
    <div className="space-y-6">
      {educationList.map((education, index) => (
        <motion.div
          key={education.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Education {index + 1}
              </h3>
            </div>
            {educationList.length > 1 && (
              <button
                onClick={() => removeEducation(education.id)}
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
                Institution *
              </label>
              <input
                type="text"
                value={education.institution}
                onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., University of Technology"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Degree *
              </label>
              <input
                type="text"
                value={education.degree}
                onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                gpa/CGPA
              </label>
              <input
                type="text"
                value={education.gpa}
                onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., CGPA:9.7 OR GPA:3.8"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Graduation Date *
              </label>
              <input
                type="text"
                value={education.graduation_date}
                onChange={(e) => updateEducation(education.id, 'graduation_date', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., May 2024"
              />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: educationList.length * 0.1 }}
        className="flex justify-center"
      >
        <button
          onClick={addEducation}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Another Education
        </button>
      </motion.div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200/50">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>
        
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
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
