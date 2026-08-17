export type Moon = { name: string };
export type Planet = {
  id: string;
  label: string;
  color: string;
  orbitRadius: number; // px
  orbitSeconds: number;
  size: number; // px
  moons: Moon[];
};
export type Scheme = {
  id: string;
  label: string;
  blurb: string;
  planets: Planet[];
};

// Every scheme below groups the same 70 skills, taken from the confirmed
// inventory (verified project usage + LinkedIn skill tags). Nothing here is
// invented for the visualization, and no scheme may drop or duplicate an
// entry — lib/stack.test-ish checks in the repo's verify scripts assert that.

const PALETTE = {
  amber: "#e0a458",
  violet: "#a78bfa",
  pink: "#d98fc4",
  teal: "#5fb8a8",
  blue: "#5b8fd4",
  green: "#7fc9a0",
  slate: "#8fa3c9",
  olive: "#b0a06a",
  red: "#d1544f",
  lilac: "#b8b3d9",
  rust: "#c9784f",
  sky: "#6fb1d9",
};

type PlanetDef = {
  id: string;
  label: string;
  color: string;
  moons: string[];
};

// Orbits always span the same range whatever the planet count, so the
// system keeps its size when you switch grouping and only the spacing
// changes. Radius and period are derived rather than hand-tuned, which is
// what lets a 4-planet scheme and a 14-planet one share one renderer.
const MIN_RADIUS = 55;
const MAX_RADIUS = 405;
const MIN_SECONDS = 24;
const MAX_SECONDS = 84;

export const STACK_MAX_RADIUS = MAX_RADIUS;

function layout(defs: PlanetDef[]): Planet[] {
  const n = defs.length;
  return defs.map((d, i) => {
    const t = n <= 1 ? 0 : i / (n - 1);
    return {
      id: d.id,
      label: d.label,
      color: d.color,
      orbitRadius: Math.round(MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS)),
      orbitSeconds: Math.round(MIN_SECONDS + t * (MAX_SECONDS - MIN_SECONDS)),
      // A planet carrying more moons reads as a bigger body, clamped so the
      // largest never swamps the smallest.
      size: Math.max(15, Math.min(22, 14 + Math.round(d.moons.length * 0.55))),
      moons: d.moons.map((name) => ({ name })),
    };
  });
}

const LAYERS: PlanetDef[] = [
  {
    id: "ai-agents",
    label: "AI & Agents",
    color: PALETTE.amber,
    moons: ["LangChain", "LangGraph", "Google ADK", "LiteLLM"],
  },
  {
    id: "ml-retrieval",
    label: "ML & Retrieval",
    color: PALETTE.violet,
    moons: [
      "Qdrant",
      "XGBoost",
      "PyTorch",
      "ONNX Runtime",
      "Embeddings",
      "MMR",
      "Graph Attention Networks",
      "Bi-LSTM",
      "Quantization",
    ],
  },
  {
    id: "data-documents",
    label: "Data & Documents",
    color: PALETTE.pink,
    moons: ["pytesseract", "pdf2image", "rapidfuzz", "SQLAlchemy", "Alembic"],
  },
  {
    id: "backend",
    label: "Backend",
    color: PALETTE.teal,
    moons: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Uvicorn",
      "Java",
      "Spring Boot",
      "JWT",
      "Maven",
      "PHP",
      "Symfony",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: PALETTE.blue,
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "databases",
    label: "Databases",
    color: PALETTE.green,
    moons: ["PostgreSQL", "MySQL", "SQLite", "H2", "PL/SQL"],
  },
  {
    id: "platforms",
    label: "Platforms",
    color: PALETTE.rust,
    moons: [
      "Odoo",
      "Chatwoot",
      "CTWA",
      "OpenRemote",
      "Supabase",
      "Google Cloud",
      "Cloudflare R2",
    ],
  },
  {
    id: "infra",
    label: "Infra & Observability",
    color: PALETTE.slate,
    moons: [
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Nginx",
      "Grafana",
      "Loki",
    ],
  },
  {
    id: "systems-networks",
    label: "Systems & Networks",
    color: PALETTE.olive,
    moons: [
      "C",
      "C++",
      "BSD sockets",
      "Unix",
      "Linux",
      "SSH",
      "DNS",
      "Networks",
      "Saleae Logic",
      "Credential Stuffing Scan",
    ],
  },
  {
    id: "craft",
    label: "Craft & Tooling",
    color: PALETTE.lilac,
    moons: [
      "Git",
      "GitHub Copilot",
      "Codex",
      "Claude",
      "Mermaid",
      "UML",
      "Bruno",
      "Mailpit",
    ],
  },
];

const BY_KIND: PlanetDef[] = [
  {
    id: "languages",
    label: "Languages",
    color: PALETTE.amber,
    moons: ["Python", "Java", "PHP", "TypeScript", "C", "C++", "PL/SQL", "HTML/CSS"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    color: PALETTE.teal,
    moons: [
      "FastAPI",
      "Flask",
      "Django",
      "Spring Boot",
      "Symfony",
      "Next.js",
      "React",
      "LangChain",
      "LangGraph",
      "Google ADK",
      "Tailwind",
      "Uvicorn",
    ],
  },
  {
    id: "libraries",
    label: "Libraries",
    color: PALETTE.violet,
    moons: [
      "PyTorch",
      "XGBoost",
      "ONNX Runtime",
      "LiteLLM",
      "pytesseract",
      "pdf2image",
      "rapidfuzz",
      "SQLAlchemy",
      "Alembic",
      "BSD sockets",
    ],
  },
  {
    id: "datastores",
    label: "Datastores",
    color: PALETTE.green,
    moons: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "H2",
      "Qdrant",
      "Supabase",
      "Cloudflare R2",
    ],
  },
  {
    id: "services",
    label: "Platforms & Services",
    color: PALETTE.rust,
    moons: [
      "Odoo",
      "Chatwoot",
      "CTWA",
      "OpenRemote",
      "Google Cloud",
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Nginx",
      "Grafana",
      "Loki",
    ],
  },
  {
    id: "techniques",
    label: "Techniques",
    color: PALETTE.red,
    moons: [
      "Embeddings",
      "MMR",
      "Quantization",
      "Graph Attention Networks",
      "Bi-LSTM",
      "JWT",
      "DNS",
      "Networks",
      "Credential Stuffing Scan",
      "UML",
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: PALETTE.lilac,
    moons: [
      "Git",
      "GitHub Copilot",
      "Codex",
      "Claude",
      "Mermaid",
      "Bruno",
      "Mailpit",
      "Saleae Logic",
      "Maven",
      "SSH",
      "Unix",
      "Linux",
    ],
  },
];

const WHERE_IT_RUNS: PlanetDef[] = [
  {
    id: "in-the-model",
    label: "In the model",
    color: PALETTE.violet,
    moons: [
      "PyTorch",
      "XGBoost",
      "ONNX Runtime",
      "Embeddings",
      "MMR",
      "Quantization",
      "Graph Attention Networks",
      "Bi-LSTM",
      "LangChain",
      "LangGraph",
      "Google ADK",
      "LiteLLM",
      "Qdrant",
    ],
  },
  {
    id: "on-the-server",
    label: "On the server",
    color: PALETTE.teal,
    moons: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Uvicorn",
      "Java",
      "Spring Boot",
      "JWT",
      "Maven",
      "PHP",
      "Symfony",
      "pytesseract",
      "pdf2image",
      "rapidfuzz",
      "SQLAlchemy",
      "Alembic",
    ],
  },
  {
    id: "in-the-browser",
    label: "In the browser",
    color: PALETTE.blue,
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "in-storage",
    label: "In storage",
    color: PALETTE.green,
    moons: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "H2",
      "PL/SQL",
      "Supabase",
      "Cloudflare R2",
    ],
  },
  {
    id: "on-the-metal",
    label: "On the wire & the metal",
    color: PALETTE.olive,
    moons: [
      "C",
      "C++",
      "BSD sockets",
      "Unix",
      "Linux",
      "SSH",
      "DNS",
      "Networks",
      "Saleae Logic",
      "OpenRemote",
      "Credential Stuffing Scan",
    ],
  },
  {
    id: "around-it-all",
    label: "Around it all",
    color: PALETTE.slate,
    moons: [
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Nginx",
      "Grafana",
      "Loki",
      "Google Cloud",
      "Odoo",
      "Chatwoot",
      "CTWA",
      "Git",
      "GitHub Copilot",
      "Codex",
      "Claude",
      "Mermaid",
      "UML",
      "Bruno",
      "Mailpit",
    ],
  },
];

const REQUEST_PATH: PlanetDef[] = [
  {
    id: "arrives",
    label: "Arrives",
    color: PALETTE.sky,
    moons: [
      "Nginx",
      "Chatwoot",
      "CTWA",
      "Odoo",
      "OpenRemote",
      "BSD sockets",
      "DNS",
      "Networks",
      "SSH",
    ],
  },
  {
    id: "understood",
    label: "Is understood",
    color: PALETTE.pink,
    moons: ["pytesseract", "pdf2image", "rapidfuzz", "Embeddings", "Qdrant", "MMR"],
  },
  {
    id: "reasoned",
    label: "Is reasoned about",
    color: PALETTE.amber,
    moons: [
      "LangChain",
      "LangGraph",
      "Google ADK",
      "LiteLLM",
      "PyTorch",
      "XGBoost",
      "ONNX Runtime",
      "Graph Attention Networks",
      "Bi-LSTM",
      "Quantization",
    ],
  },
  {
    id: "served",
    label: "Is served",
    color: PALETTE.teal,
    moons: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Uvicorn",
      "Java",
      "Spring Boot",
      "JWT",
      "Maven",
      "PHP",
      "Symfony",
    ],
  },
  {
    id: "stored",
    label: "Is stored",
    color: PALETTE.green,
    moons: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "H2",
      "PL/SQL",
      "SQLAlchemy",
      "Alembic",
      "Supabase",
      "Cloudflare R2",
    ],
  },
  {
    id: "shown",
    label: "Is shown",
    color: PALETTE.blue,
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "shipped",
    label: "Is shipped & watched",
    color: PALETTE.slate,
    moons: [
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Google Cloud",
      "Grafana",
      "Loki",
      "Git",
      "GitHub Copilot",
      "Codex",
      "Claude",
      "Mermaid",
      "UML",
      "Bruno",
      "Mailpit",
      "C",
      "C++",
      "Unix",
      "Linux",
      "Saleae Logic",
      "Credential Stuffing Scan",
    ],
  },
];

const BROAD: PlanetDef[] = [
  {
    id: "ai-systems",
    label: "AI Systems",
    color: PALETTE.amber,
    moons: [
      "LangChain",
      "LangGraph",
      "Google ADK",
      "LiteLLM",
      "Qdrant",
      "PyTorch",
      "XGBoost",
      "ONNX Runtime",
      "Embeddings",
      "MMR",
      "Graph Attention Networks",
      "Bi-LSTM",
      "Quantization",
      "pytesseract",
      "pdf2image",
      "rapidfuzz",
    ],
  },
  {
    id: "product",
    label: "Product Engineering",
    color: PALETTE.teal,
    moons: [
      "Python",
      "FastAPI",
      "Flask",
      "Django",
      "Uvicorn",
      "Java",
      "Spring Boot",
      "JWT",
      "Maven",
      "PHP",
      "Symfony",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "HTML/CSS",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "H2",
      "PL/SQL",
      "SQLAlchemy",
      "Alembic",
      "Odoo",
      "Chatwoot",
      "CTWA",
      "Supabase",
    ],
  },
  {
    id: "platform-ops",
    label: "Platform & Operations",
    color: PALETTE.slate,
    moons: [
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Nginx",
      "Grafana",
      "Loki",
      "Google Cloud",
      "Cloudflare R2",
      "Git",
      "Bruno",
      "Mailpit",
      "Mermaid",
      "UML",
      "GitHub Copilot",
      "Codex",
      "Claude",
    ],
  },
  {
    id: "systems-security",
    label: "Systems & Security",
    color: PALETTE.olive,
    moons: [
      "C",
      "C++",
      "BSD sockets",
      "Unix",
      "Linux",
      "SSH",
      "DNS",
      "Networks",
      "Saleae Logic",
      "OpenRemote",
      "Credential Stuffing Scan",
    ],
  },
];

const GRANULAR: PlanetDef[] = [
  {
    id: "agent-frameworks",
    label: "Agent Frameworks",
    color: PALETTE.amber,
    moons: ["LangChain", "LangGraph", "Google ADK", "LiteLLM"],
  },
  {
    id: "modelling",
    label: "Modelling",
    color: PALETTE.violet,
    moons: [
      "PyTorch",
      "XGBoost",
      "ONNX Runtime",
      "Graph Attention Networks",
      "Bi-LSTM",
      "Quantization",
    ],
  },
  {
    id: "retrieval",
    label: "Retrieval",
    color: PALETTE.pink,
    moons: ["Qdrant", "Embeddings", "MMR"],
  },
  {
    id: "documents",
    label: "Documents & OCR",
    color: PALETTE.rust,
    moons: ["pytesseract", "pdf2image", "rapidfuzz"],
  },
  {
    id: "languages",
    label: "Languages",
    color: PALETTE.sky,
    moons: ["Python", "Java", "PHP", "TypeScript", "C", "C++", "PL/SQL"],
  },
  {
    id: "web-frameworks",
    label: "Web Frameworks",
    color: PALETTE.teal,
    moons: ["FastAPI", "Flask", "Django", "Uvicorn", "Spring Boot", "Symfony"],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: PALETTE.blue,
    moons: ["Next.js", "React", "Tailwind", "HTML/CSS"],
  },
  {
    id: "databases",
    label: "Databases",
    color: PALETTE.green,
    moons: ["PostgreSQL", "MySQL", "SQLite", "H2"],
  },
  {
    id: "orm",
    label: "ORM & Migrations",
    color: PALETTE.green,
    moons: ["SQLAlchemy", "Alembic"],
  },
  {
    id: "platforms",
    label: "Platforms",
    color: PALETTE.rust,
    moons: ["Odoo", "Chatwoot", "CTWA", "OpenRemote", "Supabase"],
  },
  {
    id: "cloud-delivery",
    label: "Cloud & Delivery",
    color: PALETTE.slate,
    moons: [
      "Docker",
      "docker-compose",
      "GitHub Actions",
      "Nginx",
      "Google Cloud",
      "Cloudflare R2",
      "Maven",
    ],
  },
  {
    id: "observability",
    label: "Observability",
    color: PALETTE.slate,
    moons: ["Grafana", "Loki"],
  },
  {
    id: "systems-networking",
    label: "Systems & Networking",
    color: PALETTE.olive,
    moons: [
      "BSD sockets",
      "Unix",
      "Linux",
      "SSH",
      "DNS",
      "Networks",
      "JWT",
      "Saleae Logic",
      "Credential Stuffing Scan",
    ],
  },
  {
    id: "craft",
    label: "Craft",
    color: PALETTE.lilac,
    moons: [
      "Git",
      "GitHub Copilot",
      "Codex",
      "Claude",
      "Mermaid",
      "UML",
      "Bruno",
      "Mailpit",
    ],
  },
];

export const STACK_SCHEMES: Scheme[] = [
  {
    id: "layers",
    label: "Layers",
    blurb: "Grouped by where each thing sits in a system.",
    planets: layout(LAYERS),
  },
  {
    id: "kind",
    label: "By kind",
    blurb: "Grouped by what each thing is: a language, a framework, a tool.",
    planets: layout(BY_KIND),
  },
  {
    id: "runs",
    label: "Where it runs",
    blurb: "Grouped by where the code actually executes.",
    planets: layout(WHERE_IT_RUNS),
  },
  {
    id: "request",
    label: "Request path",
    blurb: "Follow one request inward to outward, from arrival to shipping.",
    planets: layout(REQUEST_PATH),
  },
  {
    id: "broad",
    label: "Four planets",
    blurb: "The whole stack in four moves.",
    planets: layout(BROAD),
  },
  {
    id: "granular",
    label: "Granular",
    blurb: "One tight idea per planet, nothing left as a catch-all.",
    planets: layout(GRANULAR),
  },
];

export const DEFAULT_SCHEME_ID = STACK_SCHEMES[0].id;
