"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Eye,
  FileText,
  Mail,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Calendar,
  Building,
  GraduationCap,
  FolderOpen,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewStepProps {
  data: any;
  onPrev: () => void;
  transformedData?: any; // Add this prop for transformed data
}

export default function PreviewStep({ data, onPrev, transformedData }: PreviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'latex'>('pdf');

  const handleDownload = async (format: 'pdf' | 'latex') => {
    try {
      setIsGenerating(true);
      
      // Debug: Log the raw data first
      console.log('Raw form data:', data);
      
      // Use transformedData if provided, otherwise transform data here
      const backendData = transformedData || {
        // Personal info - access nested properties correctly
        name: data.personal?.name || '',
        email: data.personal?.email || '',
        location: data.personal?.location || '',
        linkedin_url: data.personal?.linkedin_url || '',
        github_url: data.personal?.github_url || '',
        
        // Experience - map correctly and filter out empty ones
        experiences: Array.isArray(data.experience) ? data.experience.filter(exp => 
          (exp.title && exp.title.trim()) || (exp.company && exp.company.trim())
        ) : [],
        
        // Education - ensure proper structure and filter out empty ones
        education: Array.isArray(data.education) ? data.education.filter(edu => 
          (edu.institution && edu.institution.trim()) || (edu.degree && edu.degree.trim())
        ) : [],
        
        // Projects - handle description array properly and filter out empty ones
        projects: Array.isArray(data.projects) ? data.projects
          .filter(project => project.title && project.title.trim()) // Only include projects with titles
          .map((project: any) => ({
            title: project.title || '',
            descriptions: Array.isArray(project.description) 
              ? project.description.filter((desc: string) => desc && desc.trim()) // Filter out empty descriptions
              : []
          })) : [],
        
        // Skills - pass through as-is since it's already correct
        skills: data.skills || {}
      };

      console.log('Transformed data for backend:', JSON.stringify(backendData, null, 2));

      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: backendData,
          format: format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to generate resume: ${response.status}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating resume:', error);
      alert(`Failed to generate resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
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
              <Eye className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Preview & Download</h2>
              <p className="text-gray-400 text-lg">Review your resume and download</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Preview Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl min-h-[800px]">
                {/* Header */}
                <div className="border-b-2 border-gray-200 pb-8 mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {data.personal?.name || 'Your Name'}
                  </h1>
                  <div className="flex flex-wrap gap-6 text-gray-600 text-lg">
                    {data.personal?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        {data.personal.email}
                      </div>
                    )}
                    {data.personal?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {data.personal.location}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4">
                    {data.personal?.linkedin_url && (
                      <a href={data.personal.linkedin_url} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                        LinkedIn
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {data.personal?.github_url && (
                      <a href={data.personal.github_url} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                        <Github className="w-5 h-5" />
                        GitHub
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Building className="w-6 h-6" />
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {data.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-4 border-gray-300 pl-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                              <p className="text-lg text-gray-700">{exp.company}</p>
                            </div>
                            <div className="text-right text-gray-600">
                              <p className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {exp.dates}
                              </p>
                              <p className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exp.location}
                              </p>
                            </div>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {exp.responsibilities?.map((resp: string, idx: number) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <GraduationCap className="w-6 h-6" />
                      Education
                    </h2>
                    <div className="space-y-4">
                      {data.education.map((edu: any, index: number) => (
                        <div key={index} className="border-l-4 border-gray-300 pl-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-lg text-gray-700">{edu.institution}</p>
                            </div>
                            <div className="text-right text-gray-600">
                              <p>{edu.graduation_date}</p>
                              {edu.gpa && <p>GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <FolderOpen className="w-6 h-6" />
                      Projects
                    </h2>
                    <div className="space-y-6">
                      {data.projects.map((project: any, index: number) => (
                        <div key={index} className="border-l-4 border-gray-300 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          {project.technologies && (
                            <p className="text-lg text-gray-700 mb-2 italic">Technologies: {project.technologies}</p>
                          )}
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {/* Handle both description (singular from form) and descriptions (plural from backend) */}
                            {(project.description || project.descriptions || []).map((desc: string, idx: number) => (
                              <li key={idx}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {data.skills && Object.keys(data.skills).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Award className="w-6 h-6" />
                      Skills
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(data.skills).map(([category, skills]: [string, any]) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
                            {category.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-gray-700">{skills}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Download Section */}
            <div className="xl:col-span-1">
              <div className="bg-gray-900/30 border border-gray-700 rounded-3xl p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  Download Resume
                </h3>
                
                <div className="space-y-6">
                  <Button
                    onClick={() => handleDownload('pdf')}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-6 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-900/50"
                  >
                    {isGenerating && downloadFormat === 'pdf' ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                    Download PDF
                  </Button>
                  
                  <Button
                    onClick={() => handleDownload('latex')}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-6 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-900/50"
                  >
                    {isGenerating && downloadFormat === 'latex' ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                    Download LaTeX
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Tips:</h4>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li>• PDF is ready to use for applications</li>
                    <li>• LaTeX source for customization</li>
                    <li>• Review the preview before downloading</li>
                    <li>• Make sure all information is correct</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-start pt-10 border-t border-gray-800 mt-12">
            <Button
              type="button"
              onClick={onPrev}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-2xl px-8 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-3"
            >
              <ArrowLeft className="w-6 h-6" />
              Previous
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
