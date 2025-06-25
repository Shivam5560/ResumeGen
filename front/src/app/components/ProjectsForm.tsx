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
  title: z.string().min(2, "Project title is required"),
  technologies: z.string().min(2, "Technologies are required"),
  description: z.array(z.string().min(10, "Description is required")).min(1, "At least one description is required")
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
      onUpdate(watchedValues.projects);
    }
  }, [watchedValues.projects, onUpdate]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const onSubmit = (formData: ProjectsForm) => {
    onUpdate(formData.projects);
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
              <FolderOpen className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Projects</h2>
              <p className="text-gray-400 text-lg">Showcase your key projects</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-900/30 border border-gray-700 rounded-3xl p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    Project {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-xl px-4 py-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Project Title */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <FolderOpen className="w-6 h-6 text-gray-400" />
                      Project Title
                    </Label>
                    <Input
                      {...register(`projects.${index}.title`)}
                      placeholder="E-commerce Web Application"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.projects?.[index]?.title && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.projects[index]?.title?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Technologies */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <Code className="w-6 h-6 text-gray-400" />
                      Technologies Used
                    </Label>
                    <Input
                      {...register(`projects.${index}.technologies`)}
                      placeholder="React, Node.js, MongoDB, Express"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.projects?.[index]?.technologies && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.projects[index]?.technologies?.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Project Description - Full Width */}
                <div className="space-y-4">
                  <Label className="text-xl font-semibold text-white flex items-center gap-3">
                    <ExternalLink className="w-6 h-6 text-gray-400" />
                    Project Descriptions
                  </Label>
                  {watchedValues.projects[index]?.description?.map((desc: string, descIndex: number) => (
                    <div key={descIndex} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-medium text-gray-400">
                          Description {descIndex + 1}
                        </Label>
                        {watchedValues.projects[index]?.description?.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeDescription(index, descIndex)}
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg px-3 py-1 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        {...register(`projects.${index}.description.${descIndex}`)}
                        placeholder="Developed a full-stack e-commerce platform with user authentication, product catalog, shopping cart functionality, and payment integration..."
                        rows={4}
                        className="text-lg bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600 resize-none"
                      />
                      {errors.projects?.[index]?.description?.[descIndex] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          {errors.projects[index]?.description?.[descIndex]?.message}
                        </motion.p>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Description Button */}
                  <div className="flex justify-start pt-4">
                    <Button
                      type="button"
                      onClick={() => addDescription(index)}
                      className="bg-green-800 hover:bg-green-700 text-white border border-green-600 hover:border-green-500 rounded-xl px-6 py-3 text-base font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Description
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Project */}
            <div className="flex justify-center py-8">
              <Button
                type="button"
                onClick={() => append({
                  title: "",
                  technologies: "",
                  description: [""]
                })}
                className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white border border-blue-600 hover:border-blue-500 rounded-2xl px-10 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-4 shadow-lg hover:shadow-blue-900/50"
              >
                <Plus className="w-6 h-6" />
                Add Another Project
              </Button>
            </div>

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
                disabled={!isValid}
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 border border-gray-600 hover:border-gray-500"
              >
                Continue to Skills
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
