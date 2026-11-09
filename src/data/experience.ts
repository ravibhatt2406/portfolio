export interface Experience {
  title: string
  role?: string
  org?: string
  type?: string
  period?: string
  summary?: string
}

export const experience: Experience[] = [
  {
    title: 'Vicharanashala Lab, IIT Ropar',
    role: 'AI/ML & MERN Stack Intern',
    type: 'Internship',
    org: 'Indian Institute of Technology Ropar',
    period: 'Sep 2026 – Nov 2026',
    summary:
      'Contributed to the open-source FLN project implementing code improvements; performed EDA, preprocessing, and predictive modeling on the ICRISAT agricultural dataset using Linear Regression, Decision Tree, and Random Forest; applied K-Means clustering and explored Generative AI and MERN-stack technologies.',
  },
  {
    title: 'Open Source Contributor',
    role: 'Open Source Contributor',
    type: 'Open Source',
    org: 'FLN Project & Open Source Community',
    period: 'Aug 2026 – Present',
    summary:
      'Active contributor to open-source software including the FLN project, implementing code improvements, bug fixes, software development workflows, and modern web & AI integrations.',
  },
  {
    title: 'Titan Auto',
    role: 'Freelance Project Developer',
    type: 'Freelance Project',
    org: 'Automobile Dealership Platform',
    period: 'Project-based',
    summary:
      'Developed features for an automobile dealership platform, including customer analytics and automated sales reporting to support business insights, alongside an AI chatbot for customer assistance and vehicle queries.',
  },
]
