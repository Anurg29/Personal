export interface GithubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type ApplicationStatus =
  | "applied"
  | "assessment"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  platform: string;
  status: ApplicationStatus;
  location: string | null;
  salary_range: string | null;
  applied_date: string;
  follow_up_date: string | null;
  notes: string | null;
  job_url: string | null;
  contact_person: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationBreakdownItem {
  count: number;
  percent: number;
}

export interface StatusBreakdownItem extends ApplicationBreakdownItem {
  status: string;
}

export interface PlatformBreakdownItem extends ApplicationBreakdownItem {
  platform: string;
}

export interface ApplicationStats {
  total_applications: number;
  active_pipeline: number;
  offers: number;
  rejections: number;
  response_rate_percent: number;
  offer_rate_percent: number;
  status_breakdown: StatusBreakdownItem[];
  platform_breakdown: PlatformBreakdownItem[];
  recent_30_days: number;
  upcoming_followups: number;
}
