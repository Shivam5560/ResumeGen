"use client";

import { useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  Briefcase, 
  Building, 
  Calendar,
  MapPin,
  ListPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const experienceItemSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  dates: z.string().min(1, "Employment dates are required"),
  location: z.string().min(2, "Location is required"),
  responsibilities: z.array(z.string().min(10, "Responsibility must be at least 10 characters")).min(1, "At least one responsibility is required")
});

const experienceSchema = z.object({
  experiences: z.array(experienceItemSchema).min(1, "At least one experience is required")
});

type ExperienceForm = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ExperienceForm({ data, onUpdate, onNext, onPrev }: ExperienceFormProps) {
  const previousDataRef = useRef<string>('');
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: data.length > 0 ? data : [{
        title: "",
        company: "",
        dates: "",
        location: "",
        responsibilities: [""]
      }]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences"
  });

  const watchedValues = watch();

  // Use useCallback to prevent infinite loops
  const updateData = useCallback(() => {
    const currentDataString = JSON.stringify(watchedValues.experiences);
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onUpdate(watchedValues.experiences);
    }
  }, [watchedValues.experiences, onUpdate]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const onSubmit = (formData: ExperienceForm) => {
    onUpdate(formData.experiences);
    onNext();
  };

  const addResponsibility = (experienceIndex: number) => {
    const currentResponsibilities = watchedValues.experiences[experienceIndex]?.responsibilities || [];
    setValue(`experiences.${experienceIndex}.responsibilities`, [...currentResponsibilities, ""]);
  };

  const removeResponsibility = (experienceIndex: number, responsibilityIndex: number) => {
    const currentResponsibilities = watchedValues.experiences[experienceIndex]?.responsibilities || [];
    if (currentResponsibilities.length > 1) {
      const updatedResponsibilities = currentResponsibilities.filter((_, index) => index !== responsibilityIndex);
      setValue(`experiences.${experienceIndex}.responsibilities`, updatedResponsibilities);
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
              <Briefcase className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Work Experience</h2>
              <p className="text-gray-400 text-lg">Share your professional journey</p>
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
                    Experience {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-xl px-4 py-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Job Title */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                      Job Title
                    </Label>
                    <Input
                      {...register(`experiences.${index}.title`)}
                      placeholder="Software Engineer"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.experiences?.[index]?.title && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.experiences[index]?.title?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <Building className="w-6 h-6 text-gray-400" />
                      Company Name
                    </Label>
                    <Input
                      {...register(`experiences.${index}.company`)}
                      placeholder="Tech Corp Inc."
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.experiences?.[index]?.company && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.experiences[index]?.company?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Employment Dates */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                      Employment Dates
                    </Label>
                    <Input
                      {...register(`experiences.${index}.dates`)}
                      placeholder="Aug 2024 -- Present"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.experiences?.[index]?.dates && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.experiences[index]?.dates?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Work Location */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-gray-400" />
                      Work Location
                    </Label>
                    <Input
                      {...register(`experiences.${index}.location`)}
                      placeholder="San Francisco, CA"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.experiences?.[index]?.location && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.experiences[index]?.location?.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <ListPlus className="w-6 h-6 text-gray-400" />
                      Key Responsibilities
                    </Label>
                    <Button
                      type="button"
                      onClick={() => addResponsibility(index)}
                      className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500 rounded-xl px-6 py-3 font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Responsibility
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {watchedValues.experiences?.[index]?.responsibilities?.map((_, responsibilityIndex) => (
                      <div key={responsibilityIndex} className="flex gap-4">
                        <Textarea
                          {...register(`experiences.${index}.responsibilities.${responsibilityIndex}`)}
                          placeholder="Describe your key responsibility or achievement..."
                          className="flex-1 min-h-24 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600 resize-none"
                        />
                        {watchedValues.experiences[index]?.responsibilities.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeResponsibility(index, responsibilityIndex)}
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-xl px-4 py-2 h-fit"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {errors.experiences?.[index]?.responsibilities && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      {errors.experiences[index]?.responsibilities?.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Add New Experience */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => append({
                  title: "",
                  company: "",
                  dates: "",
                  location: "",
                  responsibilities: [""]
                })}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-2xl px-8 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                Add Another Experience
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
                Continue to Education
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
