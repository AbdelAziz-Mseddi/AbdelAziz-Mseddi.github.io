import data from "@/content/projects.json";

export type Project = {
  id: string;
  session: string;
  title: string;
  subtitle?: string;
  tier: "featured" | "standard" | "archive";
  kind: string;
  year: number;
  lanes: string[];
  stack: string[];
  blurb: string;
  detail?: string;
  context?: string;
  result?: string;
  team?: string[];
  links: { repo?: string; demo?: string };
  evidence?: {
    commits: number;
    additions: number;
    deletions: number;
    highlights: string[];
  };
};

export type Lane = { id: string; label: string; blurb: string };

export function getAllProjects(): Project[] {
  return data.projects as Project[];
}

export function getProject(id: string): Project | undefined {
  return getAllProjects().find((p) => p.id === id);
}

export function getLanes(): Lane[] {
  return data.lanes as Lane[];
}
