"use client";

import React from 'react';
import { Mail, MapPin, Github, Linkedin, Calendar, Building2, GraduationCap, FolderOpen, FileText, Award } from 'lucide-react';

interface LivePreviewProps {
  data: {
    personal?: any;
    experience?: any[];
    education?: any[];
    projects?: any[];
    skills?: any;
  };
}

const LivePreviewComponent: React.FC<LivePreviewProps> = ({ data }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = data;

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      <div className="space-y-4 text-sm p-1">
        {/* Header - Compact but professional */}
        <div className="text-center border-b border-gray-200 pb-3">
          <h1 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
            {personal.name || 'Your Name'}
          </h1>
          <div className="space-y-1 text-gray-600 text-xs">
            {personal.email && (
              <div className="flex items-center justify-center gap-1">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{personal.email}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{personal.location}</span>
              </div>
            )}
            <div className="flex justify-center gap-3 mt-2">
              {personal.linkedin_url && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3 flex-shrink-0" />
                  <span>LinkedIn</span>
                </div>
              )}
              {personal.github_url && (
                <div className="flex items-center gap-1">
                  <Github className="w-3 h-3 flex-shrink-0" />
                  <span>GitHub</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary - if exists */}
        {personal.summary && (
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1">
              Summary
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience - Optimized layout */}
        {experience.length > 0 && experience.some(exp => exp.title || exp.company) && (
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              Experience
            </h2>
            <div className="space-y-3">
              {experience.filter(exp => exp.title || exp.company).map((exp, index) => (
                <div key={index} className="border-l-3 border-indigo-300 pl-3 space-y-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1">
                        {exp.title || 'Job Title'}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        {exp.dates || 'Dates'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">
                      <span className="font-medium">{exp.company || 'Company'}</span>
                      {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
                    </p>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 ml-2">
                      {exp.responsibilities.filter(resp => resp.trim()).slice(0, 3).map((resp, respIndex) => (
                        <li key={respIndex} className="leading-tight">{resp}</li>
                      ))}
                      {exp.responsibilities.filter(resp => resp.trim()).length > 3 && (
                        <li className="text-gray-500 italic text-xs">
                          +{exp.responsibilities.filter(resp => resp.trim()).length - 3} more responsibilities...
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education - Compact layout */}
        {education.length > 0 && education.some(edu => edu.institution || edu.degree) && (
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              Education
            </h2>
            <div className="space-y-2">
              {education.filter(edu => edu.institution || edu.degree).map((edu, index) => (
                <div key={index} className="border-l-3 border-purple-300 pl-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                        {edu.institution || 'Institution'}
                      </h3>
                      <p className="text-xs text-gray-600 leading-tight">
                        {edu.degree || 'Degree'}
                        {edu.gpa && <span className="text-gray-500"> • {edu.gpa}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{edu.graduation_date || 'Date'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects - Optimized for space */}
        {projects.length > 0 && projects.some(project => project.title) && (
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              Projects
            </h2>
            <div className="space-y-3">
              {projects.filter(project => project.title).map((project, index) => (
                <div key={index} className="border-l-3 border-green-300 pl-3 space-y-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                    {project.title}
                  </h3>
                  {project.description && project.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 ml-2">
                      {project.description.filter(desc => desc.trim()).slice(0, 3).map((desc, descIndex) => (
                        <li key={descIndex} className="leading-tight">{desc}</li>
                      ))}
                      {project.description.filter(desc => desc.trim()).length > 3 && (
                        <li className="text-gray-500 italic text-xs">
                          +{project.description.filter(desc => desc.trim()).length - 3} more details...
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills - Compact grid layout */}
        {skills && Object.keys(skills).length > 0 && (
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-2">
              <Award className="w-4 h-4 flex-shrink-0" />
              Skills
            </h2>
            <div className="space-y-1.5">
              {Object.entries(skills).map(([category, skillList]) => (
                skillList && (
                  <div key={category} className="border-l-3 border-orange-300 pl-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-gray-700 text-xs capitalize leading-tight">
                        {category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-600 leading-tight">{skillList}</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Enhanced empty state */}
        {!personal.name && experience.length === 0 && education.length === 0 && projects.length === 0 && Object.keys(skills).length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-sm font-medium mb-2 text-center">Live Resume Preview</p>
            <p className="text-xs text-gray-500 max-w-60 text-center leading-relaxed">
              Your resume will appear here as you fill out the form. Start with your personal information to see the magic happen!
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
              <span>Real-time updates</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .border-l-3 {
          border-left-width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default LivePreviewComponent;
