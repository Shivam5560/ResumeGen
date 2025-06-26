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

interface PersonalInfo {
  name?: string;
  email?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
}

interface Experience {
  title?: string;
  company?: string;
  dates?: string;
  location?: string;
  responsibilities?: string[];
}

interface Education {
  institution?: string;
  degree?: string;
  graduation_date?: string;
  gpa?: string;
}

interface Project {
  title?: string;
  description?: string[];
  descriptions?: string[];
  technologies?: string;
}

interface Skills {
  [category: string]: string;
}

interface ResumeData {
  personal?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  skills?: Skills;
}

interface PreviewStepProps {
  data: ResumeData;
  onPrev: () => void;
  transformedData?: ResumeData;
}

export default function PreviewStep({ data, onPrev, transformedData }: PreviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'latex'>('pdf');

  const handleDownload = async (format: 'pdf' | 'latex') => {
    try {
      setIsGenerating(true);
      
      const backendData = transformedData || {
        name: data.personal?.name || '',
        email: data.personal?.email || '',
        location: data.personal?.location || '',
        linkedin_url: data.personal?.linkedin_url || '',
        github_url: data.personal?.github_url || '',
        
        experiences: Array.isArray(data.experience) ? data.experience.filter((exp: Experience) => 
          (exp.title && exp.title.trim()) || (exp.company && exp.company.trim())
        ) : [],
        
        education: Array.isArray(data.education) ? data.education.filter((edu: Education) => 
          (edu.institution && edu.institution.trim()) || (edu.degree && edu.degree.trim())
        ) : [],
        
        projects: Array.isArray(data.projects) ? data.projects
          .filter((project: Project) => project.title && project.title.trim())
          .map((project: Project) => ({
            title: project.title || '',
            descriptions: Array.isArray(project.description) 
              ? project.description.filter((desc: string) => desc && desc.trim())
              : []
          })) : [],
        
        skills: data.skills || {}
      };

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

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      try {
        await fetch('/api/download-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (trackError) {
      }
      
    } catch (error) {
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
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-8 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Preview & Download</h2>
              <p className="text-gray-600 text-lg">Review your resume and download</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200/50 min-h-[800px]">
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

                {data.experience && data.experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Building className="w-6 h-6" />
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {data.experience.map((exp: Experience, index: number) => (
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

                {data.education && data.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <GraduationCap className="w-6 h-6" />
                      Education
                    </h2>
                    <div className="space-y-4">
                      {data.education.map((edu: Education, index: number) => (
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

                {data.projects && data.projects.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <FolderOpen className="w-6 h-6" />
                      Projects
                    </h2>
                    <div className="space-y-6">
                      {data.projects.map((project: Project, index: number) => (
                        <div key={index} className="border-l-4 border-gray-300 pl-6">
                          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                          {project.technologies && (
                            <p className="text-lg text-gray-700 mb-2 italic">Technologies: {project.technologies}</p>
                          )}
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {(project.description || project.descriptions || []).map((desc: string, idx: number) => (
                              <li key={idx}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.skills && Object.keys(data.skills).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Award className="w-6 h-6" />
                      Skills
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(data.skills).map(([category, skills]: [string, string]) => (
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

            <div className="xl:col-span-1">
              <div className="bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 sticky top-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  Download Resume
                </h3>
                
                <div className="space-y-6">
                  <Button
                    onClick={() => handleDownload('pdf')}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-6 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
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
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {isGenerating && downloadFormat === 'latex' ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                    Download LaTeX
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Tips:</h4>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• PDF is ready to use for applications</li>
                    <li>• LaTeX source for customization</li>
                    <li>• Review the preview before downloading</li>
                    <li>• Make sure all information is correct</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start pt-10 border-t border-gray-200/50 mt-12">
            <Button
              type="button"
              onClick={onPrev}
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-indigo-300 rounded-2xl px-8 py-6 text-xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
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
