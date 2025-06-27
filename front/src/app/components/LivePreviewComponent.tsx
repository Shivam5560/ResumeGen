"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Award,
  Calendar,
  Building,
  ExternalLink
} from "lucide-react";

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

interface LivePreviewData {
  personal?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  skills?: Skills;
}

interface LivePreviewComponentProps {
  data: LivePreviewData;
}

export default function LivePreviewComponent({ data }: LivePreviewComponentProps) {
  const hasPersonalInfo = data.personal && Object.keys(data.personal).some(key => data.personal![key as keyof PersonalInfo]);
  const hasExperience = data.experience && Array.isArray(data.experience) && data.experience.length > 0 && data.experience.some(exp => exp.title || exp.company);
  const hasEducation = data.education && Array.isArray(data.education) && data.education.length > 0 && data.education.some(edu => edu.institution || edu.degree);
  const hasProjects = data.projects && Array.isArray(data.projects) && data.projects.length > 0 && data.projects.some(proj => proj.title && proj.title.trim());
  const hasSkills = data.skills && Object.keys(data.skills).length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      className="w-full h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section - Personal Info */}
      {hasPersonalInfo ? (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {data.personal?.name || 'Your Name'}
              </h2>
              <div className="space-y-1 text-sm text-gray-600">
                {data.personal?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{data.personal.email}</span>
                  </div>
                )}
                {data.personal?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{data.personal.location}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                {data.personal?.linkedin_url && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </div>
                )}
                {data.personal?.github_url && (
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <Github className="w-3 h-3" />
                    <span>GitHub</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center"
        >
          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Personal information will appear here</p>
        </motion.div>
      )}

      {/* Experience Section */}
      {hasExperience ? (
        <motion.div
          variants={sectionVariants}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Experience</h3>
          </div>
          <div className="space-y-4">
            {data.experience?.filter(exp => exp.title || exp.company).map((exp, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{exp.title || 'Job Title'}</h4>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {exp.company || 'Company Name'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {exp.dates && (
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.dates}
                      </p>
                    )}
                    {exp.location && (
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    {exp.responsibilities.filter(resp => resp.trim()).slice(0, 2).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="line-clamp-2">{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center"
        >
          <Briefcase className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Work experience will appear here</p>
        </motion.div>
      )}

      {/* Education Section */}
      {hasEducation ? (
        <motion.div
          variants={sectionVariants}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Education</h3>
          </div>
          <div className="space-y-3">
            {data.education?.filter(edu => edu.institution || edu.degree).map((edu, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{edu.degree || 'Degree'}</h4>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {edu.institution || 'Institution'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {edu.graduation_date && <p>{edu.graduation_date}</p>}
                    {edu.gpa && <p>{edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center"
        >
          <GraduationCap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Education details will appear here</p>
        </motion.div>
      )}

      {/* Projects Section - Fixed logic */}
      {hasProjects ? (
        <motion.div
          variants={sectionVariants}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
              <FolderOpen className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Projects</h3>
          </div>
          <div className="space-y-3">
            {Array.isArray(data.projects) && data.projects
              .filter(proj => proj && proj.title && proj.title.trim())
              .map((project, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{project.title}</h4>
                  {project.technologies && (
                    <p className="text-xs text-gray-600 mb-2 italic">Tech: {project.technologies}</p>
                  )}
                  {(project.description || project.descriptions) && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {(Array.isArray(project.description) ? project.description : 
                        Array.isArray(project.descriptions) ? project.descriptions : [])
                        .filter(desc => desc && desc.trim())
                        .slice(0, 2)
                        .map((desc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="line-clamp-2">{desc}</span>
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center"
        >
          <FolderOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Projects will appear here</p>
        </motion.div>
      )}

      {/* Skills Section */}
      {hasSkills ? (
        <motion.div
          variants={sectionVariants}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Skills</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data.skills || {}).map(([category, skills]) => (
              <div key={category} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 text-sm mb-2 capitalize">
                  {category.replace(/_/g, ' ')}
                </h4>
                <p className="text-xs text-gray-600">{skills}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={sectionVariants}
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center"
        >
          <Award className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Skills will appear here</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!hasPersonalInfo && !hasExperience && !hasEducation && !hasProjects && !hasSkills && (
        <motion.div
          variants={sectionVariants}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Building Your Resume</h3>
          <p className="text-gray-600 text-sm">
            Fill out the form on the left to see your resume preview here
          </p>
        </motion.div>
      )}

      {/* Add CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
