export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  href?: string;
  kind: "project" | "hackathon" | "experience";
  meta?: string;
};

export const projects: Project[] = [
  {
    slug: "remai",
    title: "Rém Data AI",
    tagline: "AI Engineer · currently",
    description:
      "Building and shipping AI systems for a startup working on ad intelligence and conversational tooling — context extraction pipelines, quality monitoring, and chat integrations running in production.",
    tech: ["Python", "LLMs", "Vector Search", "FastAPI"],
    kind: "experience",
    meta: "2026 — present",
  },
  {
    slug: "qrail",
    title: "QRail — Neural Rail Conductor",
    tagline: "Hackathon · AI decision support",
    description:
      "An operational dashboard that helps railway operators resolve incidents in real time, fusing graph neural networks, LSTM temporal modeling, and vector search over 800+ historical incidents to rank resolutions by predicted success.",
    tech: ["GNN", "LSTM", "Qdrant", "XGBoost", "Python"],
    href: "https://github.com/nourchachia/QRail",
    kind: "hackathon",
    meta: "Smart India Hackathon",
  },
  {
    slug: "lumen",
    title: "Lumen",
    tagline: "Hackathon · Menacraft 2026",
    description:
      "An AI-powered content verification platform built for “The Trust Crisis” challenge — authenticity, context, and credibility engines working together to score how much a piece of content can be trusted.",
    tech: ["Next.js", "Supabase", "Cloudflare R2", "AI"],
    href: "https://github.com/khaledbaccour/lumen",
    kind: "hackathon",
    meta: "Menacraft Hackathon",
  },
  {
    slug: "campus-connect",
    title: "Campus Connect",
    tagline: "Hackathon · TRC 3.0",
    description:
      "A campus life app conceived during TRC 3.0, built to help students discover events, share resources, and stay connected across campus.",
    tech: ["TypeScript", "React"],
    href: "https://github.com/AbdelAziz-Mseddi/Campus-Connect",
    kind: "hackathon",
    meta: "TRC 3.0",
  },
  {
    slug: "drose",
    title: "dRose",
    tagline: "CLI · music, always playing",
    description:
      "A Python CLI that downloads and manages YouTube Music playlists in one click — built because a music habit deserves better tooling than a browser tab.",
    tech: ["Python", "CLI"],
    href: "https://github.com/AbdelAziz-Mseddi/dRose",
    kind: "project",
    meta: "v1.2.0",
  },
  {
    slug: "devify",
    title: "DEVIFY",
    tagline: "Academic · UML & architecture",
    description:
      "Design and modeling of a gamified, collaborative pull-request review platform — full MVC architecture, UML diagrams, and system design deliverables for an academic software engineering project.",
    tech: ["UML", "MVC", "System Design"],
    href: "https://github.com/AbdelAziz-Mseddi/DEVIFY",
    kind: "project",
    meta: "INSAT",
  },
  {
    slug: "tutoring-manager",
    title: "Tutoring Manager API",
    tagline: "Backend · Spring Boot",
    description:
      "A REST API for managing students, classes, enrollments, tutoring sessions, and payments — JWT auth, layered service architecture, embedded Tomcat.",
    tech: ["Java", "Spring Boot", "JWT", "SQL"],
    href: "https://github.com/AbdelAziz-Mseddi/Tutoring_Manager-Server",
    kind: "project",
    meta: "INSAT",
  },
];

export const interests = [
  "Cinema",
  "Anime",
  "Music",
  "Photography",
  "Night owl",
  "Winter",
];
