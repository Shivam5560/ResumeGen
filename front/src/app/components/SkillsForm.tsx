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
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-8"
    >
      <div className="space-y-6">
        {/* Display message if no categories */}
        {categories.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No skill categories added yet. Start by adding your first category below.</p>
          </div>
        )}

        {/* Custom Categories */}
        {categories.map((categoryKey) => (
          <motion.div
            key={categoryKey}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
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
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
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
              className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
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
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Preview Resume
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
