import rrWeddingImg from '../assets/projects/rr-wedding-filmers.jpg'
import drishtiImg from '../assets/projects/drishti-surveillance.png'

export type ProjectCategory =
  | 'Web Development'
  | 'AI & Machine Learning'
  | 'Generative AI'
  | 'Data Analytics'
  | 'Hackathon Projects'
  | 'Freelance Development'

export interface Project {
  id: string
  name: string
  title: string
  category: ProjectCategory
  summary: string
  description: string
  tags: string[]
  technologies: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  liveButtonLabel?: string
  githubButtonLabel?: string
  achievement?: string | null
  image?: string | null
  status?: string | null
}

export const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'AI & Machine Learning',
  'Generative AI',
  'Web Development',
  'Data Analytics',
  'Hackathon Projects',
  'Freelance Development',
]

export const projects: Project[] = [
  {
    id: 'rr-wedding-filmers',
    name: 'RR Wedding Filmers',
    title: 'RR Wedding Filmers',
    category: 'Web Development',
    summary: 'A deployed wedding-filmmaking website project.',
    description: 'A deployed wedding-filmmaking website project built with high-performance responsive web technology.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Radix UI', 'Embla Carousel'],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Radix UI', 'Embla Carousel'],
    liveUrl: 'https://rrweddingfilmerudaipur.vercel.app/',
    githubUrl: null,
    liveButtonLabel: 'Visit Live Website',
    achievement: null,
    image: rrWeddingImg,
    status: 'Live in Production',
  },
  {
    id: 'urbanplus-ai',
    name: 'UrbanPlus.AI',
    title: 'UrbanPlus.AI',
    category: 'Hackathon Projects',
    achievement: '1st Place — Advanced Category, FutureHacks',
    summary: 'AI-powered 15-Minute City Score and Simulator concept using OpenStreetMap data.',
    description: 'An AI-powered 15-Minute City Score and Simulator concept using OpenStreetMap data to evaluate urban accessibility and the availability of essential facilities.',
    tags: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Anthropic Claude API', 'Leaflet', 'Turf.js', 'Recharts'],
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Anthropic Claude API', 'Leaflet', 'Turf.js', 'Recharts'],
    liveUrl: 'https://devpost.vercel.app/',
    githubUrl: null,
    liveButtonLabel: 'Live Demo',
    image: null,
    status: '1st Place Winner',
  },
  {
    id: 'drishti-ai',
    name: 'Drishti AI Surveillance',
    title: 'Drishti AI Surveillance',
    category: 'AI & Machine Learning',
    achievement: 'SIH 2026 Problem Statement ID 26187',
    summary: 'AI-based intelligent video analytics platform for border surveillance using existing CCTV infrastructure.',
    description: 'An AI-based intelligent video analytics platform for border surveillance using existing CCTV infrastructure. Associated with SIH 2026 Problem Statement ID 26187.',
    tags: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV', 'ByteTrack', 'DeepFace', 'WebSockets', 'React'],
    technologies: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV', 'ByteTrack', 'DeepFace', 'WebSockets', 'React'],
    liveUrl: null,
    githubUrl: 'https://github.com/ravibhatt2406/AI-Border-Surveillance',
    githubButtonLabel: 'View on GitHub',
    image: drishtiImg,
    status: 'SIH 2026 Project',
  },
  {
    id: 'supply-chain-analytics',
    name: 'Supply Chain Data Analyst',
    title: 'Supply Chain Data Analyst',
    category: 'Data Analytics',
    achievement: null,
    summary: 'Data analytics project focused on supply chain data analysis.',
    description: 'A data analytics project focused on supply chain data analysis, evaluating order fulfillment, delivery delay risk, profitability trends, and customer segments across multi-region logistics.',
    tags: ['Python', 'Pandas', 'NumPy', 'SQLite / SQL', 'Matplotlib', 'Seaborn', 'Excel Dashboard'],
    technologies: ['Python', 'Pandas', 'NumPy', 'SQLite / SQL', 'Matplotlib', 'Seaborn', 'Excel Dashboard'],
    liveUrl: null,
    githubUrl: 'https://github.com/ravibhatt2406/Supply_Chain_DataAnalysit_project',
    githubButtonLabel: 'View on GitHub',
    image: null,
    status: 'Completed',
  },
  {
    id: 'rag-based-ai',
    name: 'RAG-Based AI Teaching Assistant',
    title: 'RAG-Based AI Teaching Assistant',
    category: 'Generative AI',
    achievement: null,
    summary: 'Built a retrieval-augmented pipeline to process lecture content, generate embeddings, and answer queries with grounded context.',
    description: 'A Retrieval-Augmented Generation pipeline built to process lecture content, generate embeddings, retrieve relevant passages, and answer user questions with grounded context. Explores integration of dense retrieval with generative AI.',
    tags: ['Python', 'LLMs', 'RAG', 'Embeddings', 'Ollama API', 'BGE-M3', 'Llama 3.2'],
    technologies: ['Python', 'LLMs', 'RAG', 'Embeddings', 'Ollama API', 'BGE-M3', 'Llama 3.2'],
    liveUrl: null,
    githubUrl: 'https://github.com/ravibhatt2406/rag_based_AI',
    githubButtonLabel: 'View on GitHub',
    image: null,
    status: 'Completed',
  },
  {
    id: 'customer-churn-prediction',
    name: 'Customer Churn Prediction with Explainable ML',
    title: 'Customer Churn Prediction with Explainable ML',
    category: 'AI & Machine Learning',
    achievement: 'Explainable AI with SHAP',
    summary: 'Preprocessed customer data, engineered features, and trained XGBoost models with SHAP interpretability.',
    description: 'Preprocessed customer data, engineered features, and compared classification models using precision, recall, F1-score, and ROC-AUC. Used SHAP to interpret model behavior and identify influential churn-related features.',
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'SHAP', 'Pandas', 'NumPy', 'Model Evaluation'],
    technologies: ['Python', 'Scikit-learn', 'XGBoost', 'SHAP', 'Pandas', 'NumPy', 'Model Evaluation'],
    liveUrl: null,
    githubUrl: 'https://github.com/ravibhatt2406',
    githubButtonLabel: 'View on GitHub',
    image: null,
    status: 'Completed',
  },
  {
    id: 'titan-auto',
    name: 'Titan Auto',
    title: 'Titan Auto',
    category: 'Freelance Development',
    achievement: 'Client Freelance Delivery',
    summary: 'Automobile dealership platform with customer analytics, automated reporting, and AI chatbot.',
    description: 'Developed features for an automobile dealership platform, including customer analytics and automated sales reporting to support business insights. Integrated an AI chatbot experience for customer assistance and common vehicle-related queries alongside core web workflows.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'AI Chatbot', 'Analytics', 'NestJS', 'PostgreSQL'],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'AI Chatbot', 'Analytics', 'NestJS', 'PostgreSQL'],
    liveUrl: null,
    githubUrl: 'https://github.com/ravibhatt2406/Automobile_Dahboard',
    githubButtonLabel: 'View on GitHub',
    image: null,
    status: 'Client Freelance Project',
  },
]
