import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SUBJECTS } from '../constants';
import * as Icons from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "سهرة سعيدة";
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            {getGreeting()}، <br/>
            <span className="text-indigo-300">{user?.displayName}</span> 🚀
          </h1>
          <p className="text-indigo-100 max-w-lg text-lg opacity-90">
            جاهز تكسر الدنيا النهاردة؟ كل المحاضرات والمصادر اللي محتاجها موجودة هنا عشان تساعدك تتفوق.
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icons.BookOpen className="text-indigo-600" />
          المواد الدراسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_SUBJECTS.map((subject) => {
            // Dynamically resolve icon component
            const IconComponent = (Icons as any)[subject.icon] || Icons.Book;

            return (
              <div 
                key={subject.id}
                onClick={() => navigate(`/subject/${subject.id}`)}
                className="group cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${subject.color}`}></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`p-3 rounded-xl text-white shadow-lg ${subject.color}`}>
                    <IconComponent size={24} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {subject.profName}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">4 موارد</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icons.ArrowLeft size={16} className={document.dir === 'rtl' ? '' : 'rotate-180'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};