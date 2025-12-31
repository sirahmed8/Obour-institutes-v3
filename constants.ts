import { Subject, Resource } from './types';

export const APP_NAME = "Obour Institutes";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'sub_1',
    name: 'هندسة البرمجيات',
    profName: 'د. أحمد علاء',
    icon: 'Code',
    color: 'bg-indigo-600',
    orderIndex: 1
  },
  {
    id: 'sub_2',
    name: 'الذكاء الاصطناعي',
    profName: 'د. سارة محمود',
    icon: 'Brain',
    color: 'bg-rose-600',
    orderIndex: 2
  },
  {
    id: 'sub_3',
    name: 'شبكات الحاسب',
    profName: 'د. محمد علي',
    icon: 'Network',
    color: 'bg-cyan-600',
    orderIndex: 3
  },
  {
    id: 'sub_4',
    name: 'قواعد البيانات',
    profName: 'د. ياسمين حسن',
    icon: 'Database',
    color: 'bg-emerald-600',
    orderIndex: 4
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res_1',
    subjectId: 'sub_1',
    title: 'مقدمة في هندسة البرمجيات',
    description: 'شرح مفاهيم الـ Agile و Waterfall.',
    url: '#',
    type: 'pdf',
    orderIndex: 1,
    thumbnail: 'https://picsum.photos/400/300'
  },
  {
    id: 'res_2',
    subjectId: 'sub_1',
    title: 'المحاضرة الثانية: React Hooks',
    description: 'شرح تفصيلي للـ useState و useEffect.',
    url: '#',
    type: 'video',
    orderIndex: 2,
    thumbnail: 'https://picsum.photos/400/301'
  }
];

export const SYSTEM_PROMPT = `
You are the AI Academic Assistant for Obour Institutes. 
Your goal is to help students with their studies, summarize notes, and answer questions about the curriculum.
Speak in a friendly, supportive tone. 
If the user speaks Arabic, reply in Egyptian Arabic (friendly/professional).
`;