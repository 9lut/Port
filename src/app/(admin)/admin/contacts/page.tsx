'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Skeleton } from "@/components/ui/skeleton";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  replied_at?: string;
  created_at: string;
}

interface ContactInfo {
  id: number;
  label: string;
  value: string;
  type: 'email' | 'phone' | 'address' | 'social';
  icon?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchContactInfo();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const promptDelete = (id: number) => {
    setMessageToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const deleteMessage = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/contact-messages/${messageToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMessages();
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.is_read;
    if (filter === 'read') return message.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl bg-red-50/50" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <Skeleton className="h-6 w-32 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 sm:p-6 hover:bg-gray-50 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32 rounded-md" />
                        <Skeleton className="h-4 w-48 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-24 rounded-md hidden sm:block" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage contact messages and contact information</p>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span className="font-medium">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Contact Messages</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${filter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      All ({messages.length})
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1 rounded-full text-sm ${filter === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      onClick={() => setFilter('read')}
                      className={`px-3 py-1 rounded-full text-sm ${filter === 'read'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Read ({messages.length - unreadCount})
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        } ${!message.is_read ? 'bg-blue-25' : ''}`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {!message.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <h3 className={`font-medium ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.name}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{message.subject}</p>
                      <p className="text-xs text-gray-500 truncate">{message.message}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail / Contact Info */}
          <div className="space-y-4">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Message Details</h3>
                  <div className="flex gap-2">
                    {selectedMessage.is_read && (
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    )}
                    <button
                      onClick={() => promptDelete(selectedMessage.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{selectedMessage.name}</p>
                      <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-sm text-gray-500">{selectedMessage.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Subject</h4>
                    <p className="text-gray-700">{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Message</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Received: {formatDate(selectedMessage.created_at)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {contactInfo.map((info) => (
                    <div key={info.id} className="flex items-center gap-3">
                      {info.type === 'email' && <EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                      {info.type === 'phone' && <PhoneIcon className="h-5 w-5 text-gray-400" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{info.label}</p>
                        <p className="text-sm text-gray-600">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {contactInfo.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No contact information configured</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={deleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
