"use client";

import { useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Location is required"),
  linkedin_url: z.string().min(1, "LinkedIn URL is required"),
  github_url: z.string().min(1, "GitHub URL is required"),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  data: Record<string, any>;
  onUpdate: (data: Record<string, any>) => void;
  onNext: () => void;
}

export default function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
  const previousDataRef = useRef<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
    mode: "onChange"
  });

  const watchedValues = watch();

  // Use useCallback to memoize the update function
  const updateData = useCallback(() => {
    const currentDataString = JSON.stringify(watchedValues);
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onUpdate(watchedValues);
    }
  }, [watchedValues, onUpdate]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const onSubmit = () => {
    if (isValid) {
      onNext();
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
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Personal Information</h2>
              <p className="text-gray-400 text-lg">Let's start with your basic details</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Full Name - Full Width */}
            <div className="space-y-4">
              <Label htmlFor="name" className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
                className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
              />
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Email */}
              <div className="space-y-4">
                <Label htmlFor="email" className="text-xl font-semibold text-white flex items-center gap-3">
                  <Mail className="w-6 h-6 text-gray-400" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label htmlFor="location" className="text-xl font-semibold text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-gray-400" />
                  Location
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="City, State/Country"
                  className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                />
                {errors.location && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {errors.location.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* LinkedIn URL */}
              <div className="space-y-4">
                <Label htmlFor="linkedin_url" className="text-xl font-semibold text-white flex items-center gap-3">
                  <Linkedin className="w-6 h-6 text-blue-400" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin_url"
                  {...register("linkedin_url")}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                />
                {errors.linkedin_url && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {errors.linkedin_url.message}
                  </motion.p>
                )}
              </div>

              {/* GitHub URL */}
              <div className="space-y-4">
                <Label htmlFor="github_url" className="text-xl font-semibold text-white flex items-center gap-3">
                  <Github className="w-6 h-6 text-gray-400" />
                  GitHub Profile
                </Label>
                <Input
                  id="github_url"
                  {...register("github_url")}
                  placeholder="https://github.com/yourusername"
                  className="h-16 text-xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:border-gray-500 focus:ring-0 transition-all duration-300 text-white placeholder:text-gray-500 hover:border-gray-600"
                />
                {errors.github_url && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg border border-red-800/30"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {errors.github_url.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-10 border-t border-gray-800">
              <Button
                type="submit"
                disabled={!isValid}
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 border border-gray-600 hover:border-gray-500"
              >
                <span>Continue to Experience</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
