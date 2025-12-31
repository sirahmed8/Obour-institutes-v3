import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, Navbar } from './components/ui/Layout';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { AIStudio } from './pages/AIStudio';
import { AIChatbot } from './components/features/AIChatbot';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!user) {
    // In a real app, redirect to login. For this demo, we auto-login in AuthContext, 
    // but if that fails, we show a login prompt (simplified).
    return <LoginScreen />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const LoginScreen = () => {
  const { login } = useAuth();
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
          ع
        </div>
        <h1 className="text-2xl font-black text-gray-900">مرحباً في معاهد العبور</h1>
        <p className="text-gray-500">سجل دخولك عشان تبدأ رحلتك التعليمية الذكية.</p>
        <button 
          onClick={() => login()}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          تسجيل الدخول باستخدام Google
        </button>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
          <Outlet />
        </main>
        <AIChatbot />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          
          <Route element={<ProtectedRoute />}>
             <Route element={<AppLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/subject/:id" element={<div className="p-10 text-center font-bold text-gray-400">صفحة المادة (قيد التطوير)</div>} />
               <Route path="/notifications" element={<div className="p-10 text-center font-bold text-gray-400">لا توجد إشعارات جديدة</div>} />
             </Route>
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/ai-studio" element={<AIStudio />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}