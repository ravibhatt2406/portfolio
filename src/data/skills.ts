export interface SkillCategory {
  group: string
  items: string[]
}

export const skills: SkillCategory[] = [
  {
    group: 'Programming Languages',
    items: ['Python', 'Java', 'SQL', 'C', 'C++', 'JavaScript', 'TypeScript'],
  },
  {
    group: 'AI & Machine Learning',
    items: [
      'Scikit-learn',
      'TensorFlow',
      'XGBoost',
      'Pandas',
      'NumPy',
      'Feature Engineering',
      'Model Evaluation',
      'Machine Learning',
      'Deep Learning',
    ],
  },
  {
    group: 'Generative & Agentic AI',
    items: [
      'LangChain',
      'LangGraph',
      'RAG',
      'LLMs',
      'Embeddings',
      'AI Agents',
      'Generative AI',
    ],
  },
  {
    group: 'Web & Databases',
    items: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'NestJS',
      'Tailwind CSS',
      'shadcn/ui',
    ],
  },
  {
    group: 'Tools & Visualization',
    items: [
      'Git',
      'GitHub',
      'Jupyter Notebook',
      'VS Code',
      'Docker',
      'Matplotlib',
      'Seaborn',
      'Power BI',
      'Excel',
    ],
  },
]
