import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';

// Predefined options for easier selection
const ICON_OPTIONS = [
  'BookOpen', 'Cpu', 'Calculator', 'FlaskConical', 'Globe', 
  'Stethoscope', 'Briefcase', 'Music', 'Palette'
];

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Green', value: 'bg-emerald-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Pink', value: 'bg-pink-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Cyan', value: 'bg-cyan-500' },
];

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    profName: '',
    description: '',
    icon: 'BookOpen',
    color: 'bg-blue-500'
  });

  useEffect(() => {
    const q = query(collection(db, 'subjects'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.profName) {
        toast.error('Please fill in required fields');
        return;
    }

    try {
      await addDoc(collection(db, 'subjects'), {
        ...formData,
        createdAt: new Date().toISOString(),
        orderIndex: subjects.length // Simple ordering
      });
      toast.success('Subject created successfully');
      setFormData({
        name: '',
        profName: '',
        description: '',
        icon: 'BookOpen',
        color: 'bg-blue-500'
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Failed to create subject');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
        await deleteDoc(doc(db, 'subjects', id));
        toast.success('Subject deleted');
    } catch (error) {
        console.error('Error deleting subject:', error);
        toast.error('Failed to delete subject');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                Add New Subject
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Subject Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent"
                        placeholder="e.g. Computer Science"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Professor Name</label>
                    <input 
                        type="text" 
                        value={formData.profName}
                        onChange={e => setFormData({...formData, profName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent"
                        placeholder="e.g. Ahmed Alaa"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent h-24 resize-none"
                        placeholder="Brief overview..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Icon</label>
                        <div className="grid grid-cols-3 gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto">
                            {ICON_OPTIONS.map(iconName => {
                                const IconComp = (Icons as any)[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setFormData({...formData, icon: iconName})}
                                        className={`p-2 rounded-md flex items-center justify-center transition-colors ${formData.icon === iconName ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                        title={iconName}
                                    >
                                        <IconComp className="w-5 h-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <div className="grid grid-cols-4 gap-2">
                             {COLOR_OPTIONS.map(color => (
                                 <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({...formData, color: color.value})}
                                    className={`w-8 h-8 rounded-full ${color.value} ring-2 ring-offset-2 dark:ring-offset-gray-800 ${formData.color === color.value ? 'ring-indigo-500 scale-110' : 'ring-transparent opacity-70 hover:opacity-100 hover:scale-105'} transition-all`}
                                    title={color.label}
                                 />
                             ))}
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                    Create Subject
                </button>
            </form>
        </div>
      </div>

      {/* List View */}
      <div className="lg:col-span-2">
         <h2 className="text-xl font-bold mb-6">Existing Subjects ({subjects.length})</h2>
         
         {loading ? (
             <div className="text-center py-10">Loading...</div>
         ) : subjects.length === 0 ? (
             <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                 No subjects found. Create one to get started.
             </div>
         ) : (
             <div className="grid gap-4">
                 {subjects.map(subject => {
                     const IconComp = (Icons as any)[subject.icon] || BookOpen;
                     // Safe color fallback
                     const colorClass = subject.color || 'bg-blue-500';
                     const textColorClass = colorClass.replace('bg-', 'text-').replace('500', '600');

                     return (
                         <div key={subject.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 ${textColorClass}`}>
                                     <IconComp className={`w-6 h-6`} />
                                 </div>
                                 <div className={`w-2 h-12 rounded-full ${colorClass}`}></div>
                                 <div>
                                     <h3 className="font-bold text-lg dark:text-white">{subject.name}</h3>
                                     <p className="text-sm text-gray-500 dark:text-gray-400">Dr. {subject.profName}</p>
                                 </div>
                             </div>
                             
                             <button 
                                onClick={() => handleDelete(subject.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                             </button>
                         </div>
                     );
                 })}
             </div>
         )}
      </div>
    </div>
  );
};

export default SubjectManager;
