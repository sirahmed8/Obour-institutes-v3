import React from 'react';
import { FileText, Link as LinkIcon, Download, ExternalLink } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    type: 'pdf' | 'link';
    url: string;
    createdAt?: string;
}

interface ResourceListProps {
    resources: Resource[];
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
    if (resources.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No resources added to this subject yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {resources.map((resource) => (
                <div 
                    key={resource.id}
                    className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className={`
                            p-3 rounded-lg flex-shrink-0
                            ${resource.type === 'pdf' 
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}
                        `}>
                            {resource.type === 'pdf' ? <FileText size={24} /> : <LinkIcon size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {resource.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {resource.type} Resource
                            </span>
                        </div>
                    </div>

                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                        title={resource.type === 'pdf' ? 'Download' : 'Open Link'}
                    >
                        {resource.type === 'pdf' ? <Download size={20} /> : <ExternalLink size={20} />}
                    </a>
                </div>
            ))}
        </div>
    );
};
