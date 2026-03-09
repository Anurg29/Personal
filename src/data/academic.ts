export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface AcademicProject {
  title: string;
  tech: string[];
  description: string;
  link?: string;
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Java" },
      { name: "C++" },
      { name: "SQL" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "HTML/CSS" },
      { name: "Framer Motion" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js" },
      { name: "Django" },
      { name: "Express" },
      { name: "REST APIs" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
    ],
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git" },
      { name: "Docker" },
      { name: "Linux" },
      { name: "VS Code" },
      { name: "GitHub Actions" },
      { name: "AWS" },
    ],
  },
  {
    title: "AI / ML",
    skills: [
      { name: "Hugging Face" },
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "LangChain" },
      { name: "OpenAI API" },
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Bachelor of Engineering in Computer Science",
    institution: "Your University",
    period: "2020 - 2024",
    description:
      "Focused on software engineering, data structures, algorithms, and artificial intelligence.",
  },
];

export const academicProjects: AcademicProject[] = [
  {
    title: "CareFlow - Hospital Queue Management",
    tech: ["Django", "React", "PostgreSQL", "WebSocket"],
    description:
      "Real-time hospital queue management system with patient tracking, doctor dashboards, and automated notifications.",
    link: "https://github.com",
  },
  {
    title: "Personal Hub - Jarvis Dashboard",
    tech: ["Next.js", "TypeScript", "Tailwind", "Hugging Face"],
    description:
      "Personal AI-powered dashboard with GitHub portfolio integration, Jarvis chatbot, and academic showcase.",
  },
];
