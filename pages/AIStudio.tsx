import React, { useState } from 'react';
import { Wand2, Video, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateImage, generateVideo } from '../services/aiService';

type Tab = 'image' | 'video' | 'voice';

export const AIStudio = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === 'image') {
        const url = await generateImage(prompt, true); // Pro mode
        setResult(url);
      } else if (activeTab === 'video') {
        const url = await generateVideo(prompt);
        setResult(url);
      } else {
        // Voice is handled via streaming usually, this is a placeholder for the logic
        setResult('voice_session_active'); 
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء التوليد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Wand2 className="text-indigo-600" size={32} />
          استوديو الذكاء الإبداعي
        </h1>
        <p className="text-gray-500">أدوات توليد المحتوى الاحترافية للمشرفين.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 inline-flex">
          {[
            { id: 'image', icon: ImageIcon, label: 'توليد الصور' },
            { id: 'video', icon: Video, label: 'توليد الفيديو' },
            { id: 'voice', icon: Mic, label: 'محادثة صوتية' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setResult(null); }}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px] flex flex-col md:flex-row">
        {/* Controls */}
        <div className="p-6 md:w-1/3 border-l border-gray-100 bg-gray-50 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الوصف (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'voice' ? 'اضغط لبدء الجلسة...' : 'اوصف اللي عايز تنشئه بالتفصيل...'}
              className="w-full h-32 p-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm resize-none"
              disabled={activeTab === 'voice'}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || (!prompt && activeTab !== 'voice')}
            className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
            {activeTab === 'voice' ? 'بدء الجلسة' : 'بدء التوليد'}
          </button>
        </div>

        {/* Output */}
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50/50 relative">
          {loading && (
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">جاري معالجة إبداعك...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="text-center text-gray-400">
              <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                 {activeTab === 'image' && <ImageIcon size={40} />}
                 {activeTab === 'video' && <Video size={40} />}
                 {activeTab === 'voice' && <Mic size={40} />}
              </div>
              <p>النتيجة هتظهر هنا</p>
            </div>
          )}

          {!loading && result && activeTab === 'image' && (
            <img src={result} alt="Generated" className="max-w-full max-h-[400px] rounded-lg shadow-lg" />
          )}

          {!loading && result && activeTab === 'video' && (
            <video controls src={result} className="max-w-full max-h-[400px] rounded-lg shadow-lg" />
          )}

          {!loading && result && activeTab === 'voice' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic size={48} className="text-indigo-600" />
              </div>
              <p className="text-indigo-900 font-bold">جاري الاستماع...</p>
              <button 
                onClick={() => setResult(null)} 
                className="text-red-500 text-sm font-bold border border-red-200 px-4 py-1 rounded-full hover:bg-red-50"
              >
                إنهاء الجلسة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};