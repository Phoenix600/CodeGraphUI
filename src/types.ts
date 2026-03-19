export interface Project {
  id: string;
  title: string;
  role: string;
  startDate: string;
  endDate?: string;
  isOngoing?: boolean;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  mode: string;
  role: string;
  startDate: string;
  endDate?: string;
  isOngoing?: boolean;
  description: string;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  location: string;
  avatarUrl: string;
  bio: string;
  skills: {
    languages: string;
    frameworks: string;
    databases: string;
    tools: string;
  };
  education: {
    university: string;
    degree: string;
    currentRole: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  workExperience: WorkExperience[];
  projects: Project[];
  streak: number;
}
