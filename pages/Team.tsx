import React from 'react';
import { Github, Linkedin, Mail, Twitter, Code2, Coffee, Heart } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Ahmed Alaa',
    role: 'Lead Developer & Architect',
    bio: 'Full-stack developer passionate about building scalable educational platforms and AI integration.',
    image: 'https://ui-avatars.com/api/?name=Ahmed+Alaa&background=6366f1&color=fff',
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  // Add more members here
];

export const Team = () => {
  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
             <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Meet the Team</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
           The minds behind the Obour Institutes Platform v2. Built with <Heart className="inline w-5 h-5 text-red-500 animate-pulse" /> and a lot of <Coffee className="inline w-5 h-5 text-amber-700" />.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full p-2 bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800"
                    />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
                    {member.role}
                </span>
                
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    {member.bio}
                </p>

                <div className="flex justify-center gap-4">
                    <a href={member.social.github} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Github className="w-6 h-6" />
                    </a>
                    <a href={member.social.linkedin} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-6 h-6" />
                    </a>
                    <a href={member.social.twitter} className="p-2 text-gray-400 hover:text-sky-500 transition-colors">
                        <Twitter className="w-6 h-6" />
                    </a>
                </div>
            </div>
        ))}
      </div>
      
      {/* Footer Note */}
      <div className="text-center pt-10 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-400">© 2024 Obour Institutes. All rights reserved.</p>
      </div>
    </div>
  );
};
