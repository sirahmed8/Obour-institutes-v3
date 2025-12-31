import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ResourceList } from '../components/features/ResourceList';
import { ArrowLeft, BookOpen, Clock, User, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

export const SubjectView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<any>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [headerColor, setHeaderColor] = useState('bg-indigo-600');

    useEffect(() => {
        if (!id) return;

        const fetchSubject = async () => {
            try {
                const docRef = doc(db, 'subjects', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSubject({ id: docSnap.id, ...data });
                    // Set color if available, or keep default
                    if (data.color) {
                         // Extract the color part safely (e.g. bg-blue-500 -> bg-blue-600 for header)
                        // A simple mapping or just use the color as is if it's a bg class
                        setHeaderColor(data.color.replace('500', '600')); 
                    }
                } else {
                    console.log("No such subject!");
                }
            } catch (error) {
                console.error("Error fetching subject:", error);
            }
        };

        // Realtime resources listener
        const q = query(collection(db, 'subjects', id, 'resources'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResources(res);
            setLoading(false);
        });

        fetchSubject();
        return () => unsubscribe();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading subject content...</div>;
    }

    if (!subject) {
        return (
            <div className="p-10 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subject Not Found</h2>
                <p className="text-gray-500 mb-6">The subject you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Go Home
                </button>
            </div>
        );
    }

    const IconComp = (Icons as any)[subject.icon] || BookOpen;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-20">
            {/* Header Banner */}
            <div className={`${headerColor} text-white pt-10 pb-24 px-6 lg:px-10 relative overflow-hidden transition-colors duration-500`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div className="max-w-5xl mx-auto relative z-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 w-fit px-4 py-2 rounded-full transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
                            <IconComp className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black mb-2">{subject.name}</h1>
                            <div className="flex items-center gap-4 text-indigo-100">
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    <User className="w-4 h-4" />
                                    Dr. {subject.profName}
                                </span>
                                {resources.length > 0 && (
                                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        <BookOpen className="w-4 h-4" />
                                        {resources.length} Resources
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-6 lg:px-10 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content: Resources */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About this Subject</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {subject.description || "No description provided for this subject."}
                            </p>
                        </div>

                         {/* Resources List */}
                         <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                Course Materials
                            </h3>
                            <ResourceList resources={resources} />
                         </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-1 space-y-6">
                         {/* Quick Actions / Stats could go here */}
                         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg">
                             <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                             <p className="text-indigo-100 text-sm mb-4">
                                 The AI Assistant can explain complex topics from this subject.
                             </p>
                             <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition shadow-md">
                                 Ask AI Tutor
                             </button>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
