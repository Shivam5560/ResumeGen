"use client";

import { useCallback, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  FolderOpen
} from "lucide-react";

const projectItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  technologies: z.string().optional(),
  description: z.array(z.string().min(1, "Description is required")).min(1, "At least one description is required")
});

const projectsSchema = z.object({
  projects: z.array(projectItemSchema).min(1, "At least one project is required")
});

type ProjectsForm = z.infer<typeof projectsSchema>;

interface ProjectsFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ProjectsForm({ data, onUpdate, onNext, onPrev }: ProjectsFormProps) {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  
  console.log('ProjectsForm received data:', safeData);
  
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProjectsForm>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: safeData.length > 0 ? safeData : [{
        title: "",
        technologies: "",
        description: [""]
      }]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects"
  });

  const watchedValues = watch();

  // Immediate update function - no debouncing for now
  const updateData = useCallback(() => {
    const projectsData = watchedValues.projects || [];
    console.log('ProjectsForm updateData called with:', projectsData);
    onUpdate(projectsData);
  }, [watchedValues.projects, onUpdate]);

  // Call updateData whenever watchedValues changes
  useEffect(() => {
    updateData();
  }, [watchedValues.projects]);

  const handleNext = () => {
    const finalData = watchedValues.projects || [];
    console.log('ProjectsForm handleNext - sending data:', finalData);
    onUpdate(finalData);
    onNext();
  };

  const handlePrev = () => {
    const finalData = watchedValues.projects || [];
    console.log('ProjectsForm handlePrev - sending data:', finalData);
    onUpdate(finalData);
    onPrev();
  };

  const addDescription = (projectIndex: number) => {
    const currentDescriptions = watchedValues.projects[projectIndex]?.description || [""];
    setValue(`projects.${projectIndex}.description`, [...currentDescriptions, ""]);
  };

  const removeDescription = (projectIndex: number, descriptionIndex: number) => {
    const currentDescriptions = watchedValues.projects[projectIndex]?.description || [""];
    if (currentDescriptions.length > 1) {
      const updatedDescriptions = currentDescriptions.filter((_, index) => index !== descriptionIndex);
      setValue(`projects.${projectIndex}.description`, updatedDescriptions);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full p-4">
      <div className="space-y-6 h-full overflow-y-auto">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-2xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Project {index + 1}</h3>
                    <p className="text-sm text-gray-600">Notable projects and accomplishments</p>
                  </div>
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
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
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FolderOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register(`projects.${index}.title`)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="e.g., E-commerce Web Application"
                    />
                  </div>
                  {errors.projects?.[index]?.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projects[index]?.title?.message}
                    </p>
                  )}
                </motion.div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Descriptions
                    </label>
                    <button
                      type="button"
                      onClick={() => addDescription(index)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Add Description
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(watchedValues.projects[index]?.description || [""]).map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-3">
                        <textarea
                          {...register(`projects.${index}.description.${descIndex}`)}
                          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 min-h-[80px] resize-y placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                          placeholder="Describe a key feature, technology used, or outcome achieved..."
                        />
                        {(watchedValues.projects[index]?.description || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDescription(index, descIndex)}
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
          transition={{ duration: 0.5, delay: fields.length * 0.1 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={() => append({
              title: "",
              technologies: "",
              description: [""]
            })}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Another Project
          </button>
        </motion.div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrev}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            {isValid ? (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                All projects completed
              </div>
            ) : (
              <span>Please complete all required fields</span>
            )}
          </div>
          
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg ${
              isValid 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Skills
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
