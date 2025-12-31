import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wand2,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: LayoutDashboard },
    { name: 'استوديو الذكاء', path: '/ai-studio', icon: Wand2, adminOnly: true },
    { name: 'لوحة التحكم', path: '/admin', icon: ShieldCheck, adminOnly: true },
    { name: 'الإشعارات', path: '/notifications', icon: Bell },
  ];

  const activeClass = "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:shadow-none border-l border-gray-100
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-20 flex items-center justify-center border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                ع
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg leading-tight">معاهد العبور</h1>
                <p className="text-xs text-gray-400">نظام إدارة التعلم الذكي</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${isActive ? activeClass : inactiveClass}
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={user?.photoURL || 'https://via.placeholder.com/40'} 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 lg:flex-none"></div> 

      <div className="flex items-center gap-4">
        {/* Placeholder for future header items like search */}
      </div>
    </header>
  );
};