'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BriefcaseIcon, AcademicCapIcon, CodeBracketIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { Skeleton } from "@/components/ui/skeleton";



interface Skill {
      id: string;
      name: string;
      icon_url: string;
      level: string;
      created_at: string;
      updated_at: string;
}

interface Experience {
      id: number;
      company: string;
      position: string;
      description: string;
      start_date: string;
      end_date?: string;
      is_current: boolean;
      location?: string;
      skills_used: string[];
      is_published: boolean;
      display_order: number;
      created_at: string;
      updated_at: string;
}

interface Education {
      id: number;
      institution: string;
      degree: string;
      field_of_study: string;
      start_date: string;
      end_date?: string;
      is_current: boolean;
      location?: string;
      description?: string;
      grade?: string;
      is_published: boolean;
      display_order: number;
      created_at: string;
      updated_at: string;
}

export default function HomeAboutSection() {
      const [skills, setSkills] = useState<Skill[]>([]);
      const [experiences, setExperiences] = useState<Experience[]>([]);
      const [educations, setEducations] = useState<Education[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const fetchData = async () => {
                  setIsLoading(true);
                  try {
                        await Promise.all([
                              fetchSkills(),
                              fetchExperiences(),
                              fetchEducations()
                        ]);
                  } catch (error) {
                        console.error('Error fetching data:', error);
                  } finally {
                        setIsLoading(false);
                  }
            };

            fetchData();
      }, []);

      const fetchSkills = async () => {
            try {
                  const response = await fetch('/api/skills');
                  if (response.ok) {
                        const data = await response.json();
                        setSkills(data);
                  }
            } catch (error) {
                  console.error('Error fetching skills:', error);
            }
      };

      const fetchExperiences = async () => {
            try {
                  const response = await fetch('/api/experience');
                  if (response.ok) {
                        const data = await response.json();
                        setExperiences(data.filter((exp: Experience) => exp.is_published));
                  }
            } catch (error) {
                  console.error('Error fetching experiences:', error);
            }
      };

      const fetchEducations = async () => {
            try {
                  const response = await fetch('/api/education');
                  if (response.ok) {
                        const data = await response.json();
                        setEducations(data.filter((edu: Education) => edu.is_published));
                  }
            } catch (error) {
                  console.error('Error fetching educations:', error);
            }
      };

      if (isLoading) {
            return (
                  <section className="py-20 bg-gradient-to-br from-white via-sky-50 to-blue-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                    <Skeleton className="aspect-square w-full rounded-[2rem]" />
                                    <div className="space-y-6 pt-8">
                                          <Skeleton className="h-12 w-3/4 rounded-xl" />
                                          <Skeleton className="h-4 w-full rounded-md" />
                                          <Skeleton className="h-4 w-5/6 rounded-md" />
                                          <div className="grid grid-cols-3 gap-4 mt-8">
                                                {[1, 2, 3].map((i) => (
                                                      <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>
            );
      }

      return (
            <section className="py-20 bg-gradient-to-br from-white via-sky-50 to-blue-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
                              {/* Mobile: Profile Image at top, Desktop: Left Column - Profile Image (Sticky) */}
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="order-1 lg:order-none lg:sticky lg:top-50 mb-8 lg:mb-0 lg:self-start"
                              >
                                    <div className="relative max-w-sm mx-auto">
                                          {/* Background decorations */}
                                          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-blue-300 rounded-2xl transform rotate-3 opacity-60"></div>
                                          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-2xl transform -rotate-2 opacity-40"></div>

                                          {/* Main image container */}
                                          <div className="hidden sm:block relative bg-white rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-300">

                                                {/* Image */}
                                                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
                                                      <div className="w-full h-full relative">
                                                            <Image
                                                                  src="https://ssfpvdjhgwxncucrrffq.supabase.co/storage/v1/object/public/project-images/uploads/Lutfee2.jpg"
                                                                  alt="Profile Picture"
                                                                  fill
                                                                  className="object-cover"
                                                                  priority
                                                            />
                                                      </div>
                                                </div>

                                                {/* Status */}
                                                <div className="mt-3 flex justify-center">
                                                      <div className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full text-xs font-medium shadow">
                                                            Available for work
                                                      </div>
                                                </div>

                                                {/* Email */}
                                                <div className="hidden sm:flex mt-3 justify-center">
                                                      <a
                                                            href="mailto:dl.lutfee@gmail.com"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition"
                                                      >
                                                            <EnvelopeIcon className="w-4 h-4" />
                                                            dl.lutfee@gmail.com
                                                      </a>
                                                </div>
                                          </div>
                                    </div>
                              </motion.div>

                              {/* Mobile: Content below image, Desktop: Right Column - Content Area */}
                              <div className="order-2 lg:order-none space-y-8">
                                    {/* Section Header */}
                                    <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.6 }}
                                          className="text-center lg:text-left"
                                    >
                                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                                About <span className="text-sky-500">Me</span>
                                          </h2>

                                          <p className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed">
                                                I’m a <span className="font-semibold text-gray-900">passionate developer</span> who enjoys turning
                                                <span className="text-sky-600 font-medium"> ideas </span>
                                                into
                                                <span className="text-sky-600 font-medium"> meaningful digital experiences</span>. <br />

                                                With a strong focus on
                                                <span className="font-semibold text-gray-900"> modern technologies</span>, I build solutions that are not just functional —
                                                but <span className="italic text-gray-800">impactful</span>.
                                          </p>
                                    </motion.div>

                                    {/* Email */}
                                    <div className="flex sm:hidden mt-3 justify-center">
                                          <a
                                                href="mailto:dl.lutfee@gmail.com"
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition"
                                          >
                                                <EnvelopeIcon className="w-4 h-4" />
                                                dl.lutfee@gmail.com
                                          </a>
                                    </div>

                                    {/* Tab Navigation */}
                                    <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.6, delay: 0.1 }}
                                          className="space-y-12"
                                    >
                                          {/* Skills Section */}
                                          <div>
                                                <div className="flex items-center space-x-3 mb-4 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg p-2">
                                                      <CodeBracketIcon className="ml-5 w-5 h-5 text-white" />
                                                      <h3 className="text-xl font-bold text-white">Skills</h3>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                                                      {skills.map((skill) => (
                                                            <motion.div
                                                                  key={skill.id}
                                                                  initial={{ opacity: 0, y: 40 }}
                                                                  whileInView={{ opacity: 1, y: 0 }}
                                                                  viewport={{ once: true, margin: "-50px" }}
                                                                  transition={{
                                                                        duration: 0.6,
                                                                        ease: [0.22, 1, 0.36, 1],
                                                                  }}
                                                                  className="bg-white/90 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-sky-100 hover:border-sky-300 transition-all duration-200 hover:shadow-lg"
                                                            >
                                                                  <div className="flex items-center space-x-2 md:space-x-3">

                                                                        {/* ICON */}
                                                                        {skill.icon_url ? (
                                                                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                                    <img
                                                                                          src={skill.icon_url}
                                                                                          alt={skill.name}
                                                                                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                                                                                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                                                                const target = e.target as HTMLImageElement;
                                                                                                target.style.display = 'none';
                                                                                                const parent = target.parentElement;
                                                                                                if (parent) {
                                                                                                      parent.innerHTML = `<div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs md:text-sm font-bold">${skill.name.charAt(0).toUpperCase()}</div>`;
                                                                                                }
                                                                                          }}
                                                                                    />
                                                                              </div>
                                                                        ) : (
                                                                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                                                                                    <span className="text-white text-xs md:text-sm font-bold">
                                                                                          {skill.name.charAt(0).toUpperCase()}
                                                                                    </span>
                                                                              </div>
                                                                        )}

                                                                        {/* TEXT */}
                                                                        <div className="flex-1 min-w-0">
                                                                              <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate">
                                                                                    {skill.name}
                                                                              </h4>
                                                                              <p className="text-[10px] md:text-xs text-sky-600 font-medium bg-sky-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full inline-block">
                                                                                    {skill.level}
                                                                              </p>
                                                                        </div>
                                                                  </div>
                                                            </motion.div>
                                                      ))}

                                                      {skills.length === 0 && !isLoading && (
                                                            <div className="text-center py-8 text-gray-500 col-span-2">
                                                                  <CodeBracketIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                                  <p>No skills records found</p>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>

                                          {/* Education Section */}
                                          <div>
                                                <div className="flex items-center space-x-3 mb-4 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg p-2">
                                                      <AcademicCapIcon className="ml-5 w-5 h-5 text-white" />
                                                      <h3 className="text-xl font-bold text-white">Education</h3>
                                                </div>
                                                <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl">
                                                      <div className="relative">
                                                            {/* Timeline line */}
                                                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 to-sky-600"></div>
                                                            <div className="space-y-6 sm:space-y-8">
                                                                  {educations.map((edu, index) => (
                                                                        <motion.div
                                                                              key={edu.id}
                                                                              initial={{ opacity: 0, y: 20 }}
                                                                              whileInView={{ opacity: 1, y: 0 }}
                                                                              viewport={{ once: true }}
                                                                              transition={{ duration: 0.5, delay: index * 0.1 }}
                                                                              className="relative pl-8 sm:pl-12"
                                                                        >
                                                                              {/* Timeline dot */}
                                                                              <div className="absolute left-1 w-4 h-4 rounded-full bg-sky-400 shadow-lg">
                                                                              </div>
                                                                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                                                                    <div className="flex-1">
                                                                                          <div className="flex items-center mb-2">
                                                                                                <span className="text-xs font-bold py-1 px-2 rounded-full bg-sky-100 text-sky-700">
                                                                                                      {new Date(edu.start_date).getFullYear()} - {
                                                                                                            edu.is_current ? 'Present' :
                                                                                                                  edu.end_date ? new Date(edu.end_date).getFullYear() : 'N/A'
                                                                                                      }
                                                                                                </span>
                                                                                          </div>
                                                                                          <h4 className="text-lg font-bold text-gray-900 mb-1">{edu.degree}</h4>
                                                                                          <p className="text-sky-700 font-semibold text-sm mb-2">{edu.institution}</p>
                                                                                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm text-blue-600 font-medium mb-3">
                                                                                                <span>{edu.field_of_study}</span>
                                                                                                {edu.location && (
                                                                                                      <>
                                                                                                            <span className="hidden sm:inline">•</span>
                                                                                                            <span className="text-xs text-gray-500">{edu.location}</span>
                                                                                                      </>
                                                                                                )}
                                                                                          </div>
                                                                                          {edu.description && (
                                                                                                <p className="text-gray-700 mb-3 leading-relaxed text-sm">{edu.description}</p>
                                                                                          )}
                                                                                          {edu.grade && (
                                                                                                <div className="inline-flex items-center">
                                                                                                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs rounded-full font-medium">
                                                                                                            Grade: {edu.grade}
                                                                                                      </span>
                                                                                                </div>
                                                                                          )}
                                                                                    </div>
                                                                              </div>
                                                                        </motion.div>
                                                                  ))}

                                                                  {educations.length === 0 && !isLoading && (
                                                                        <div className="text-center py-8 text-gray-500">
                                                                              <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                                              <p>No education records found</p>
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Experience Section */}
                                          <div>
                                                <div className="flex items-center space-x-3 mb-4 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg p-2">
                                                      <BriefcaseIcon className="ml-5 w-5 h-5 text-white" />
                                                      <h3 className="text-xl font-bold text-white">Experience</h3>
                                                </div>
                                                <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl">
                                                      <div className="relative">
                                                            {/* Timeline line */}
                                                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 to-sky-600"></div>
                                                            <div className="space-y-6 sm:space-y-8">
                                                                  {experiences.map((exp, index) => (
                                                                        <motion.div
                                                                              key={exp.id}
                                                                              initial={{ opacity: 0, y: 20 }}
                                                                              whileInView={{ opacity: 1, y: 0 }}
                                                                              transition={{ duration: 0.5, delay: index * 0.1 }}
                                                                              className="relative pl-8 sm:pl-12"
                                                                        >
                                                                              {/* Timeline dot */}
                                                                              <div className="absolute left-1 w-4 h-4 rounded-full bg-sky-400 shadow-lg">
                                                                              </div>
                                                                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                                                                    <div className="flex-1">
                                                                                          <div className="flex items-center mb-2">
                                                                                                <span className="text-xs font-bold py-1 px-2 rounded-full bg-sky-100 text-sky-700">
                                                                                                      {new Date(exp.start_date).getFullYear()} - {
                                                                                                            exp.is_current ? 'Present' :
                                                                                                                  exp.end_date ? new Date(exp.end_date).getFullYear() : 'N/A'
                                                                                                      }
                                                                                                </span>
                                                                                          </div>
                                                                                          <h4 className="text-lg font-bold text-gray-900 mb-1">{exp.position}</h4>
                                                                                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm text-sky-700 font-semibold mb-3">
                                                                                                <span>{exp.company}</span>
                                                                                                {exp.location && (
                                                                                                      <>
                                                                                                            <span className="hidden sm:inline">•</span>
                                                                                                            <span className="text-xs text-gray-500">{exp.location}</span>
                                                                                                      </>
                                                                                                )}
                                                                                          </div>
                                                                                          <p className="text-gray-700 mb-3 leading-relaxed text-sm">{exp.description}</p>
                                                                                          {exp.skills_used && exp.skills_used.length > 0 && (
                                                                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                                                      {exp.skills_used.slice(0, 6).map((skill, skillIndex) => (
                                                                                                            <span
                                                                                                                  key={skillIndex}
                                                                                                                  className="px-2 sm:px-3 py-1 bg-white text-sky-700 border border-sky-200 text-xs rounded-full font-medium hover:bg-sky-50 transition-colors"
                                                                                                            >
                                                                                                                  {skill}
                                                                                                            </span>
                                                                                                      ))}
                                                                                                      {exp.skills_used.length > 6 && (
                                                                                                            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                                                                                  +{exp.skills_used.length - 6} more
                                                                                                            </span>
                                                                                                      )}
                                                                                                </div>
                                                                                          )}
                                                                                    </div>
                                                                              </div>
                                                                        </motion.div>
                                                                  ))}

                                                                  {experiences.length === 0 && !isLoading && (
                                                                        <div className="text-center py-8 text-gray-500">
                                                                              <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                                              <p>No experience records found</p>
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </motion.div>
                              </div>
                        </div>
                  </div>
            </section>
      );
}
