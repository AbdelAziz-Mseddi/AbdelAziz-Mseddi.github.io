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

/** Lane accent colours, shared by the work index and anything else that
 *  needs to tag a project by discipline. Kept next to the lane type rather
 *  than in a component so the two can't drift apart. */
export const LANE_COLOR: Record<string, string> = {
  "ai-ml": "#e0a458",
  backend: "#5fb8a8",
  devops: "#8fa3c9",
  "low-level": "#b0a06a",
  security: "#d1544f",
};

export function getAllProjects(): Project[] {
  return data.projects as Project[];
}

export function getProject(id: string): Project | undefined {
  return getAllProjects().find((p) => p.id === id);
}

export function getLanes(): Lane[] {
  return data.lanes as Lane[];
}
