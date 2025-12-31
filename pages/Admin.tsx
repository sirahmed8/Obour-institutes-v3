import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Activity, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'السبت', views: 4000, downloads: 2400 },
  { name: 'الأحد', views: 3000, downloads: 1398 },
  { name: 'الاثنين', views: 2000, downloads: 9800 },
  { name: 'الثلاثاء', views: 2780, downloads: 3908 },
  { name: 'الأربعاء', views: 1890, downloads: 4800 },
  { name: 'الخميس', views: 2390, downloads: 3800 },
  { name: 'الجمعة', views: 3490, downloads: 4300 },
];

export const Admin = () => {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">لوحة التحكم ⚙️</h1>
          <p className="text-gray-500">نظرة عامة على أداء المنصة والطلاب.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition font-bold text-sm">
          تصدير تقرير PDF
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'الطلاب النشطين', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'الموارد المحملة', value: '45.2k', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'جلسات الذكاء', value: '892', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'تنبيهات النظام', value: '3', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 mb-6">إحصائيات التفاعل الأسبوعي</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: '#f8fafc'}}
            />
            <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} name="مشاهدات" />
            <Bar dataKey="downloads" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="تحميلات" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};