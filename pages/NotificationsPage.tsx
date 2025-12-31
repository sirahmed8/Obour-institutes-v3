import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  createdAt: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Welcome to Obour Platform v2',
    message: 'We are excited to have you here! Explore your new dashboard and subjects.',
    type: 'success',
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Friday at 2:00 AM.',
    type: 'warning',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true
  }
];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime listener for notifications
    try {
        const q = query(
            collection(db, 'notifications'), 
            orderBy('createdAt', 'desc'), 
            limit(20)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
                setNotifications(data);
            } else {
                setNotifications(MOCK_NOTIFICATIONS);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setNotifications(MOCK_NOTIFICATIONS);
            setLoading(false);
        });

        return () => unsubscribe();
    } catch (err) {
        console.warn("Firestore access failed, using mocks", err);
        setNotifications(MOCK_NOTIFICATIONS);
        setLoading(false);
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'alert': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30';
      case 'alert': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
      case 'success': return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30';
      default: return 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30';
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
          <Bell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">الإشعارات</h1>
          <p className="text-gray-500 dark:text-gray-400">آخر التحديثات والأخبار المهمة من المعهد.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="text-center py-20 text-gray-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
             <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                 <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <p className="text-gray-500">لا توجد إشعارات حالياً</p>
             </div>
        ) : (
            notifications.map((note) => (
                <div 
                    key={note.id} 
                    className={`p-6 rounded-2xl border flex items-start gap-4 transition-all hover:shadow-md ${getBgColor(note.type)}`}
                >
                    <div className="flex-shrink-0 mt-1">
                        {getIcon(note.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{note.title}</h3>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {note.message}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
