"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  GraduationCap,
  Building,
  Calendar,
  Award
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
    <div className="w-full h-full p-4">
      <div className="space-y-6 h-full overflow-y-auto">
        {educationList.map((education, index) => (
          <motion.div
            key={education.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Education {index + 1}</h3>
                    <p className="text-sm text-gray-600">Educational background and qualifications</p>
                  </div>
                </div>
                {educationList.length > 1 && (
                  <button
                    onClick={() => removeEducation(education.id)}
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
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., University of Technology"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA/CGPA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Award className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={education.gpa}
                      onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., CGPA: 9.7 OR GPA: 3.8"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Graduation Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={education.graduation_date}
                      onChange={(e) => updateEducation(education.id, 'graduation_date', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., May 2024"
                    />
                  </div>
                </motion.div>
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
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Another Education
          </button>
        </motion.div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              onUpdate(educationList);
              onPrev();
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
                All education completed
              </div>
            ) : (
              <span>Please complete all required fields</span>
            )}
          </div>
          
          <motion.button
            onClick={() => {
              onUpdate(educationList);
              onNext();
            }}
            disabled={!isFormValid}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg ${
              isFormValid 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Projects
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
