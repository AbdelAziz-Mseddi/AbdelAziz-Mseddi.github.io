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
    title: "Rém Data & AI",
    tagline: "AI Engineer · currently",
    description:
      "Started as an intern, then part-time, now full-time AI Engineer — five months to earn the title. Building agentic AI systems for a startup working on ad intelligence and conversational tooling: LangGraph/Google ADK agent pipelines, Qdrant-backed retrieval, Odoo integrations, quality monitoring running in production.",
    tech: ["Python", "LangChain", "LangGraph", "Google ADK", "Qdrant", "Docker"],
    kind: "experience",
    meta: "Intern → Full-time, 2026",
  },
  {
    slug: "qrail",
    title: "QRail — Neural Rail Conductor",
    tagline: "Hackathon · AI decision support",
    description:
      "An operational dashboard that helps railway operators resolve incidents in real time, fusing graph attention networks, Bi-LSTM temporal modeling, and Qdrant semantic search over 800+ historical incidents to rank resolutions by predicted success — 4-way visual comparisons across a 50-station network.",
    tech: ["GNN", "LSTM", "Qdrant", "XGBoost", "Python"],
    href: "https://github.com/nourchachia/QRail",
    kind: "hackathon",
    meta: "Top 11 / 85 — Vectors in Orbit",
  },
  {
    slug: "logz-fraudec",
    title: "LOGZ FRAUDEC",
    tagline: "Hackathon · insurance fraud AI",
    description:
      "Can insurers trust digital evidence in a cyber claim? An on-premise ML tool that scores fraud risk by spotting tampered logs and impossible incident timelines — built in 48 hours with coaching from EY.",
    tech: ["Python", "ML", "Forensics"],
    kind: "hackathon",
    meta: "Hack for Smart Insurance — Dauphine Tunis × EY",
  },
  {
    slug: "cr3m3-brul33",
    title: "CR3M3 BRUL33",
    tagline: "Hardware CTF · won",
    description:
      "A Securinets workshop on how hackers break IoT devices turned into a hardware Capture-The-Flag — signal analysis and protocol debugging with Saleae Logic, decrypting signals under time pressure. Team won.",
    tech: ["IoT Security", "Saleae Logic", "Hardware"],
    kind: "hackathon",
    meta: "Won — Securinets",
  },
  {
    slug: "driveguardai",
    title: "DriveGuardAI",
    tagline: "Hackathon · insurance telematics",
    description:
      "An enterprise-grade dashboard turning raw driver telemetry — braking, acceleration, fatigue signals — into insurance driver scores. Next.js/Tailwind frontend, Flask backend processing real-time logs.",
    tech: ["Next.js", "Tailwind", "Flask", "Python"],
    kind: "hackathon",
    meta: "Top 10 Finalist — Hack For Good 4.0",
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

export const certifications = [
  {
    title: "Vectors in Orbit Hackathon",
    org: "Google Developer Group Sup'Com Tunisia",
    detail: "Certificate of participation — ranked 11/85",
  },
  {
    title: "Code Quest 3.0",
    org: "ACM INSAT Student Chapter",
    detail: "Beginner competitive-programming competition",
  },
  {
    title: "A Gentle Introduction to AI on Azure",
    org: "Microsoft",
    detail: "Issued Nov 2025",
  },
];

export const community = [
  {
    org: "Google Developer Group on Campus — INSAT",
    role: "Member",
    period: "Sep 2025 – May 2026",
  },
  {
    org: "ACM INSAT Student Chapter",
    role: "Member — Organising Committee, Certified Nvidia Workshop (2024)",
    period: "Sep 2024 – May 2026",
  },
];
