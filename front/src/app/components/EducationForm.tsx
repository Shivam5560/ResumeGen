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
  GraduationCap, 
  School, 
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const educationItemSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().min(2, "Degree/Program is required"),
  graduation_date: z.string().min(1, "Graduation date is required"),
  gpa: z.string().optional()
});

const educationSchema = z.object({
  education: z.array(educationItemSchema).min(1, "At least one education entry is required")
});

type EducationForm = z.infer<typeof educationSchema>;

interface EducationFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function EducationForm({ data, onUpdate, onNext, onPrev }: EducationFormProps) {
  const previousDataRef = useRef<string>('');
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: data.length > 0 ? data : [{
        institution: "",
        degree: "",
        graduation_date: "",
        gpa: ""
      }]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const watchedValues = watch();

  // Use useCallback to prevent infinite loops
  const updateData = useCallback(() => {
    const currentDataString = JSON.stringify(watchedValues.education);
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onUpdate(watchedValues.education);
    }
  }, [watchedValues.education, onUpdate]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const onSubmit = (formData: EducationForm) => {
    onUpdate(formData.education);
    onNext();
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
              <GraduationCap className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Education</h2>
              <p className="text-gray-400 text-lg">Your academic background</p>
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
                    Education {index + 1}
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
                  {/* Institution */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <School className="w-6 h-6 text-gray-400" />
                      Institution Name
                    </Label>
                    <Input
                      {...register(`education.${index}.institution`)}
                      placeholder="University of Technology"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.education?.[index]?.institution && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.education[index]?.institution?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Degree/Program */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-gray-400" />
                      Degree/Program
                    </Label>
                    <Input
                      {...register(`education.${index}.degree`)}
                      placeholder="Bachelor of Science in Computer Science"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.education?.[index]?.degree && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.education[index]?.degree?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Graduation Date */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                      Graduation Date
                    </Label>
                    <Input
                      {...register(`education.${index}.graduation_date`)}
                      placeholder="May 2024"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                    {errors.education?.[index]?.graduation_date && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {errors.education[index]?.graduation_date?.message}
                      </motion.p>
                    )}
                  </div>

                  {/* GPA (Optional) */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white flex items-center gap-3">
                      <div className="w-6 h-6 text-gray-400 flex items-center justify-center font-bold">GPA</div>
                      GPA (Optional)
                    </Label>
                    <Input
                      {...register(`education.${index}.gpa`)}
                      placeholder="3.8/4.0"
                      className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Education */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => append({
                  institution: "",
                  degree: "",
                  graduation_date: "",
                  gpa: ""
                })}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-2xl px-8 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                Add Another Education
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
                Continue to Projects
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
