"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Award,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const skillsSchema = z.object({
  skills: z.record(z.string()).optional()
});

type SkillsForm = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SkillsForm({ data, onUpdate, onNext, onPrev }: SkillsFormProps) {
  const [newCategory, setNewCategory] = useState('');

  const {
    handleSubmit,
    formState: { isValid }
  } = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: data || {}
    },
    mode: "onChange"
  });

  const onSubmit = () => {
    onNext();
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      const categoryKey = newCategory.toLowerCase().replace(/\s+/g, '_');
      const updatedSkills = { ...data, [categoryKey]: '' };
      onUpdate(updatedSkills);
      setNewCategory('');
    }
  };

  const updateCategorySkills = (categoryKey: string, skillsString: string) => {
    const updatedSkills = { ...data, [categoryKey]: skillsString };
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-black/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black px-8 py-8 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
              <Award className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Skills</h2>
              <p className="text-gray-400 text-lg">Highlight your expertise</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Add New Category */}
            <div className="bg-gray-900/30 border border-gray-700 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Plus className="w-7 h-7 text-gray-400" />
                Add New Skill Category
              </h3>
              <div className="flex gap-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Programming Languages, Tools, Frameworks"
                  className="flex-1 h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addCategory}
                  disabled={!newCategory.trim()}
                  className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500 rounded-2xl px-8 py-4 text-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Category
                </Button>
              </div>
            </div>

            {/* Existing Skills Categories */}
            <div className="space-y-8">
              {Object.entries(skillsData).map(([categoryKey, skillsString]) => (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-900/30 border border-gray-700 rounded-3xl p-8 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-400" />
                      {categoryDisplayName(categoryKey)}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => removeCategory(categoryKey)}
                      className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-xl px-4 py-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-300">
                      Skills (comma-separated)
                    </Label>
                    <Textarea
                      value={skillsString || ''}
                      onChange={(e) => updateCategorySkills(categoryKey, e.target.value)}
                      placeholder="JavaScript, Python, React, Node.js, MongoDB"
                      className="min-h-32 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600 resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Enter skills separated by commas. Example: JavaScript, Python, React
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {Object.keys(skillsData).length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">No skills added yet</h3>
                <p className="text-gray-500">Add your first skill category above to get started</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-10 border-t border-gray-800">
              <Button
                type="button"
                onClick={onPrev}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-2xl px-8 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-3"
              >
                <ArrowLeft className="w-6 h-6" />
                Previous
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 flex items-center gap-4 border border-gray-600 hover:border-gray-500"
              >
                Continue to Preview
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
