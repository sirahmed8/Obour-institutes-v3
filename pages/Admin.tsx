import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, LayoutDashboard } from 'lucide-react';
import SubjectManager from '../components/features/admin/SubjectManager';
import ResourceManager from '../components/features/admin/ResourceManager';
import UserManager from '../components/features/admin/UserManager';

type Tab = 'dashboard' | 'subjects' | 'resources' | 'users';

export const Admin = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Admin Dashboard ⚙️</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage content, users, and platform settings.</p>
        </div>
      </div>

       {/* Tabs */}
       <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 border-b border-gray-200 dark:border-gray-800">
        {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'users', label: 'Users', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-6">
          {activeTab === 'dashboard' && (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-400">Overview Panel</h3>
                  <p className="text-sm text-gray-400">Stats are temporarily disabled while we update the system.</p>
              </div>
          )}

          {activeTab === 'subjects' && <SubjectManager />}

          {activeTab === 'resources' && <ResourceManager />}

          {activeTab === 'users' && <UserManager />}
      </div>
    </div>
  );
};