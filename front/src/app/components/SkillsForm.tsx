"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Award
} from "lucide-react";

interface SkillsFormProps {
  data: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
  onNext: (stepData: Record<string, any>) => void;
  onPrev: (stepData: Record<string, any>) => void;
}

export default function SkillsForm({ data, onUpdate, onNext, onPrev }: SkillsFormProps) {
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory.trim()) {
      const categoryKey = newCategory.toLowerCase().replace(/\s+/g, '_');
      const updatedSkills = { ...data, [categoryKey]: '' };
      onUpdate(updatedSkills);
      setNewCategory('');
    }
  };

  const updateCategorySkills = (categoryKey: string, skillsString: string) => {
    const skillsToSend = typeof skillsString === 'string' ? skillsString : String(skillsString || '');
    const updatedSkills = { ...data, [categoryKey]: skillsToSend };
    onUpdate(updatedSkills);
  };

  const removeCategory = (categoryKey: string) => {
    const updatedSkills = { ...data };
    delete updatedSkills[categoryKey];
    onUpdate(updatedSkills);
  };

  const categoryDisplayName = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const skillsData = data || {};
  const categories = Object.keys(skillsData);

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
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Skills & Expertise</h3>
              <p className="text-sm text-gray-600">Add your technical and professional skills</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Display message if no categories */}
            {categories.length === 0 && (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No skill categories added yet. Start by adding your first category below.</p>
              </div>
            )}

            {/* Custom Categories */}
            {categories.map((categoryKey, index) => (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    {categoryDisplayName(categoryKey)}
                  </label>
                  <button
                    onClick={() => removeCategory(categoryKey)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={skillsData[categoryKey] || ''}
                  onChange={(e) => updateCategorySkills(categoryKey, e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Enter skills separated by commas..."
                />
              </motion.div>
            ))}

            {/* Add Custom Category */}
            <div className={`${categories.length > 0 ? 'border-t border-gray-200/50 pt-6' : ''}`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Add skill category (e.g., Programming Languages, Frameworks, Tools)..."
                />
                <button
                  onClick={addCategory}
                  disabled={!newCategory.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
            <button
              onClick={() => {
                onUpdate(skillsData);
                onPrev(skillsData);
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              {categories.length > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Skills added successfully
                </div>
              ) : (
                <span>Add at least one skill category</span>
              )}
            </div>
            
            <motion.button
              onClick={() => {
                onUpdate(skillsData);
                onNext(skillsData);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl"
            >
              Preview Resume
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
