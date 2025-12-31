import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { collection, addDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { uploadFile } from '../../../services/storage';
import { toast } from 'sonner';
import { FileText, Link as LinkIcon, Upload, Loader2, Plus } from 'lucide-react';

const ResourceManager: React.FC = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        subjectId: '',
        title: '',
        type: 'pdf' as 'pdf' | 'link',
        linkUrl: '',
        file: null as File | null
    });

    useEffect(() => {
        const q = query(collection(db, 'subjects'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubjects(subs);
            setLoadingSubjects(false);
            if (subs.length > 0 && !form.subjectId) {
                setForm(prev => ({ ...prev, subjectId: subs[0].id }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.subjectId || !form.title) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (form.type === 'link' && !form.linkUrl) {
            toast.error("Please enter a valid URL.");
            return;
        }

        if (form.type === 'pdf' && !form.file) {
            toast.error("Please select a file to upload.");
            return;
        }

        setUploading(true);

        try {
            let resourceUrl = form.linkUrl;

            if (form.type === 'pdf' && form.file) {
                 const path = `resources/${form.subjectId}/${Date.now()}_${form.file.name}`;
                 resourceUrl = await uploadFile(form.file, path);
            }

            // Save to subcollection
            await addDoc(collection(db, 'subjects', form.subjectId, 'resources'), {
                title: form.title,
                type: form.type,
                url: resourceUrl,
                createdAt: new Date().toISOString()
            });

            toast.success("Resource added successfully!");
            setForm(prev => ({
                ...prev,
                title: '',
                linkUrl: '',
                file: null
            }));
            // Reset file input manually if needed
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error("Error adding resource:", error);
            toast.error("Failed to add resource.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                Add New Resource
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Select */}
                <div>
                    <label className="block text-sm font-medium mb-1">Select Subject</label>
                    {loadingSubjects ? (
                         <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    ) : (
                        <select 
                            value={form.subjectId}
                            onChange={(e) => setForm({...form, subjectId: e.target.value})}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-transparent"
                        >
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Resource Type */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setForm({...form, type: 'pdf'})}
                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${form.type === 'pdf' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                    >
                        <FileText className="w-6 h-6" />
                        <span className="font-bold">PDF Document</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm({...form, type: 'link'})}
                        className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${form.type === 'link' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                    >
                        <LinkIcon className="w-6 h-6" />
                        <span className="font-bold">External Link</span>
                    </button>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Resource Title</label>
                    <input 
                        type="text" 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent"
                        placeholder="e.g. Lecture 1 Slides"
                    />
                </div>

                {/* Conditional Input */}
                {form.type === 'link' ? (
                     <div>
                        <label className="block text-sm font-medium mb-1">Link URL</label>
                        <input 
                            type="url" 
                            value={form.linkUrl}
                            onChange={e => setForm({...form, linkUrl: e.target.value})}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent"
                            placeholder="https://..."
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-1">File Upload</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                            <input 
                                id="file-upload"
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setForm({...form, file: e.target.files ? e.target.files[0] : null})}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Upload className="w-8 h-8" />
                                <span className="text-sm">
                                    {form.file ? form.file.name : "Click to browse or drag PDF here"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading...
                        </>
                    ) : 'Add Resource'}
                </button>
            </form>
        </div>
    );
};

export default ResourceManager;
