'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
      AcademicCapIcon,
      BriefcaseIcon,
      ChatBubbleLeftRightIcon,
      EyeIcon,
      CogIcon,
      ArrowPathIcon,
      DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
      skills_count: number;
      story_count: number;
      experience_count: number;
      unread_messages: number;
      projects_count: number;
}

export default function AdminDashboard() {
      const [stats, setStats] = useState<DashboardStats>({
            skills_count: 0,
            story_count: 0,
            experience_count: 0,
            unread_messages: 0,
            projects_count: 0
      });
      const [isLoading, setIsLoading] = useState(true);
      const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

      useEffect(() => {
            fetchDashboardStats();
      }, []);

      const fetchDashboardStats = async () => {
            try {
                  setIsLoading(true);
                  console.log('Dashboard: Fetching stats...');

                  const response = await fetch('/api/admin/dashboard-simple', {
                        cache: 'no-store',
                        headers: {
                              'Cache-Control': 'no-cache'
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        console.log('Dashboard: Received data:', data);
                        setStats(data);
                        setLastUpdated(new Date());
                  } else {
                        console.error('Dashboard: API response not OK:', response.status);
                  }
            } catch (error) {
                  console.error('Dashboard: Error fetching stats:', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const statsCards = [
            {
                  name: 'Total Projects',
                  value: stats.projects_count,
                  icon: DocumentTextIcon,
                  color: 'bg-cyan-500',
                  lightColor: 'bg-cyan-50',
                  textColor: 'text-cyan-600',
            },
            {
                  name: 'Total Skills',
                  value: stats.skills_count,
                  icon: AcademicCapIcon,
                  color: 'bg-sky-500',
                  lightColor: 'bg-sky-50',
                  textColor: 'text-sky-600',
            },
            {
                  name: 'Total Experience',
                  value: stats.experience_count,
                  icon: BriefcaseIcon,
                  color: 'bg-indigo-500',
                  lightColor: 'bg-indigo-50',
                  textColor: 'text-indigo-600',
            },
            {
                  name: 'Unread Messages',
                  value: stats.unread_messages,
                  icon: ChatBubbleLeftRightIcon,
                  color: stats.unread_messages > 0 ? 'bg-rose-500' : 'bg-slate-400',
                  lightColor: stats.unread_messages > 0 ? 'bg-rose-50' : 'bg-slate-50',
                  textColor: stats.unread_messages > 0 ? 'text-rose-600' : 'text-slate-600',
            },
      ];

      const quickActions = [
            {
                  title: 'Create Project',
                  description: 'Add a new project to your portfolio',
                  href: '/admin/projects',
                  icon: DocumentTextIcon,
                  color: 'from-cyan-400 to-cyan-600'
            },
            {
                  title: 'Add New Skill',
                  description: 'Add a new technical skill or tool with logo',
                  href: '/admin/about',
                  icon: AcademicCapIcon,
                  color: 'from-sky-400 to-sky-600'
            },
            {
                  title: 'Add Experience',
                  description: 'Document your work experience and achievements',
                  href: '/admin/about',
                  icon: BriefcaseIcon,
                  color: 'from-indigo-400 to-indigo-600'
            },
      ];

      return (
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                  <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                          Dashboard
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                          Welcome back! Here&apos;s what&apos;s happening with your portfolio.
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                          Last updated: {lastUpdated.toLocaleTimeString()}
                                    </p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                                    <button
                                          onClick={fetchDashboardStats}
                                          disabled={isLoading}
                                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-sky-200 text-sky-700 rounded-lg hover:bg-sky-50 transition-colors disabled:opacity-50 text-sm"
                                    >
                                          <ArrowPathIcon className="w-4 h-4 mr-2" />
                                          Refresh
                                    </button>
                                    <Link
                                          href="/"
                                          target="_blank"
                                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                                    >
                                          <EyeIcon className="w-4 h-4 mr-2" />
                                          View Site
                                    </Link>
                              </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
                              {statsCards.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                          <motion.div
                                                key={stat.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="col-span-1"
                                          >
                                                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-4 sm:p-6 transition-all duration-200">
                                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex-1">
                                                                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{stat.name}</p>
                                                                  <div className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                                                                        {isLoading ? <Skeleton className="h-8 w-16 rounded-md" /> : stat.value}
                                                                  </div>
                                                            </div>
                                                            <div className={`${stat.color} p-2 sm:p-3 rounded-full mt-2 sm:mt-0 self-start sm:self-auto`}>
                                                                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                                            </div>
                                                      </div>
                                                </div>
                                          </motion.div>
                                    );
                              })}
                        </div>

                        {/* Quick Actions */}
                        <div>
                              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">Quick Actions</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {quickActions.map((action, index) => {
                                          const Icon = action.icon;
                                          return (
                                                <motion.div
                                                      key={action.title}
                                                      initial={{ opacity: 0, y: 20 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ delay: 0.5 + index * 0.1 }}
                                                >
                                                      <Link
                                                            href={action.href}
                                                            className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block"
                                                      >
                                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                                  <div className={`bg-gradient-to-r ${action.color} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                  </div>
                                                                  <div className="flex-1 min-w-0">
                                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition-colors truncate">
                                                                              {action.title}
                                                                        </h3>
                                                                        <p className="text-gray-600 mt-1 text-sm sm:text-base">{action.description}</p>
                                                                  </div>
                                                            </div>
                                                      </Link>
                                                </motion.div>
                                          );
                                    })}
                              </div>
                        </div>

                        {/* Portfolio Overview */}
                        <div>
                              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6">Portfolio Overview</h2>
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-4 sm:p-6">
                                          <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Skills & Tools</h3>
                                                <div className="p-2 bg-sky-50 rounded-lg">
                                                      <CogIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                                                </div>
                                          </div>
                                          <div className="space-y-3">
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                      Showcase your technical expertise with tool logos and proficiency levels.
                                                </p>
                                                <div className="flex items-center justify-between">
                                                      <div className="text-xs sm:text-sm font-medium text-sky-600">{isLoading ? <Skeleton className="h-4 w-6 rounded-md inline-block" /> : stats.skills_count}</div>
                                                </div>
                                                <Link
                                                      href="/admin/skills"
                                                      className="inline-flex items-center text-xs sm:text-sm text-sky-600 hover:text-sky-800 font-medium"
                                                >
                                                      Manage Skills →
                                                </Link>
                                          </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-cyan-100 p-4 sm:p-6">
                                          <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Projects & Experience</h3>
                                                <div className="p-2 bg-cyan-50 rounded-lg">
                                                      <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                                                </div>
                                          </div>
                                          <div className="space-y-3">
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                      Display your portfolio projects and professional experience.
                                                </p>
                                                <div className="flex justify-between items-center">
                                                      <div className="text-xs sm:text-sm font-medium text-cyan-600">{isLoading ? <Skeleton className="h-4 w-6 rounded-md inline-block" /> : stats.projects_count}</div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                      <div className="text-xs sm:text-sm font-medium text-cyan-600">{isLoading ? <Skeleton className="h-4 w-6 rounded-md inline-block" /> : stats.experience_count}</div>
                                                </div>
                                                <Link
                                                      href="/admin/projects"
                                                      className="inline-flex items-center text-xs sm:text-sm text-cyan-600 hover:text-cyan-800 font-medium"
                                                >
                                                      Manage Projects →
                                                </Link>
                                          </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 p-4 sm:p-6">
                                          <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact & Messages</h3>
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                      <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                                </div>
                                          </div>
                                          <div className="space-y-3">
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                      Share your personal story and manage contact messages.
                                                </p>
                                                <div className="flex justify-between items-center">
                                                      <span className="text-xs sm:text-sm text-gray-600">Unread Messages</span>
                                                      <div className={`text-xs sm:text-sm font-medium flex items-center h-5 ${stats.unread_messages > 0 ? 'text-rose-600' : 'text-gray-600'}`}>
                                                            {isLoading ? <Skeleton className="h-4 w-6 rounded-md inline-block" /> : stats.unread_messages}
                                                      </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                      <div className="text-xs sm:text-sm font-medium text-blue-600">{isLoading ? <Skeleton className="h-4 w-6 rounded-md inline-block" /> : stats.story_count}</div>
                                                </div>
                                                <Link
                                                      href="/admin/contacts"
                                                      className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                      View Messages →
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
