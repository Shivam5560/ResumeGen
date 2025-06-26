"use client";

import { useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  FolderOpen, 
  Code, 
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const projectItemSchema = z.object({
  title: z.string().min(2, "Title is required"),
  technologies: z.string().optional(),
  description: z.array(z.string().min(10, "Description must be at least 10 characters")).min(1, "At least one description is required") // Keep as description for form
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
  const previousDataRef = useRef<string>('');
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProjectsForm>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: data.length > 0 ? data : [{
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

  // Use useCallback to prevent infinite loops
  const updateData = useCallback(() => {
    const currentDataString = JSON.stringify(watchedValues.projects);
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onUpdate(watchedValues.projects); // Send projects array directly
    }
  }, [watchedValues.projects, onUpdate]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const onSubmit = (formData: ProjectsForm) => {
    onUpdate(formData.projects); // Send projects array directly
    onNext();
  };

  // Helper function to add description
  const addDescription = (projectIndex: number) => {
    const currentDescriptions = watchedValues.projects[projectIndex]?.description || [""];
    setValue(`projects.${projectIndex}.description`, [...currentDescriptions, ""]);
  };

  // Helper function to remove description
  const removeDescription = (projectIndex: number, descriptionIndex: number) => {
    const currentDescriptions = watchedValues.projects[projectIndex]?.description || [""];
    if (currentDescriptions.length > 1) {
      const updatedDescriptions = currentDescriptions.filter((_, index) => index !== descriptionIndex);
      setValue(`projects.${projectIndex}.description`, updatedDescriptions);
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Project {index + 1}
              </h3>
            </div>
            {fields.length > 1 && (
              <button
                onClick={() => remove(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                {...register(`projects.${index}.title`)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., E-commerce Web Application"
              />
              {errors.projects?.[index]?.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projects[index]?.title?.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Project Descriptions
                </label>
                <button
                  onClick={() => addDescription(index)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Description
                </button>
              </div>

              <div className="space-y-3">
                {watchedValues.projects[index]?.description?.map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-3">
                    <textarea
                      {...register(`projects.${index}.description.${descIndex}`)}
                      className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm min-h-[80px] resize-y"
                      placeholder="Describe a key feature, technology used, or outcome achieved..."
                    />
                    {watchedValues.projects[index]?.description?.length > 1 && (
                      <button
                        onClick={() => removeDescription(index, descIndex)}
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
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fields.length * 0.1 }}
        className="flex justify-center"
      >
        <button
          onClick={() => append({
            title: "",
            technologies: "",
            description: [""]
          })}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Another Project
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
          type="submit"
          disabled={!isValid}
          className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
            isValid 
              ? 'hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Continue to Skills
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
