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

type PlanetDef = {
  id: string;
  label: string;
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

// Planet colour is orbital temperature, not a category code. Inner bodies
// run hot and pale gold, outer ones cool through the site's dusty blue to a
// cold slate. Two hue families, both already in globals.css, instead of a
// twelve-hue wheel that appears nowhere else on the site. Deriving it from
// orbit position also means every scheme is coloured consistently without a
// single hand-picked value.
const TEMPERATURE: { t: number; rgb: [number, number, number] }[] = [
  { t: 0, rgb: [245, 220, 174] },
  { t: 0.34, rgb: [217, 160, 102] },
  { t: 0.68, rgb: [157, 184, 232] },
  { t: 1, rgb: [107, 117, 148] },
];

function temperatureColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  let lo = TEMPERATURE[0];
  let hi = TEMPERATURE[TEMPERATURE.length - 1];
  for (let i = 0; i < TEMPERATURE.length - 1; i++) {
    if (clamped >= TEMPERATURE[i].t && clamped <= TEMPERATURE[i + 1].t) {
      lo = TEMPERATURE[i];
      hi = TEMPERATURE[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t;
  const k = span === 0 ? 0 : (clamped - lo.t) / span;
  const hex = lo.rgb.map((v, i) =>
    Math.round(v + (hi.rgb[i] - v) * k)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${hex.join("")}`;
}

function layout(defs: PlanetDef[]): Planet[] {
  const n = defs.length;
  return defs.map((d, i) => {
    const t = n <= 1 ? 0 : i / (n - 1);
    return {
      id: d.id,
      label: d.label,
      color: temperatureColor(t),
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
    moons: ["LangChain", "LangGraph", "Google ADK", "LiteLLM"],
  },
  {
    id: "ml-retrieval",
    label: "ML & Retrieval",
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
    moons: ["pytesseract", "pdf2image", "rapidfuzz", "SQLAlchemy", "Alembic"],
  },
  {
    id: "backend",
    label: "Backend",
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
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "databases",
    label: "Databases",
    moons: ["PostgreSQL", "MySQL", "SQLite", "H2", "PL/SQL"],
  },
  {
    id: "platforms",
    label: "Platforms",
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
    moons: ["Python", "Java", "PHP", "TypeScript", "C", "C++", "PL/SQL", "HTML/CSS"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
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
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "in-storage",
    label: "In storage",
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
    moons: ["pytesseract", "pdf2image", "rapidfuzz", "Embeddings", "Qdrant", "MMR"],
  },
  {
    id: "reasoned",
    label: "Is reasoned about",
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
    moons: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS"],
  },
  {
    id: "shipped",
    label: "Is shipped & watched",
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
    moons: ["LangChain", "LangGraph", "Google ADK", "LiteLLM"],
  },
  {
    id: "modelling",
    label: "Modelling",
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
    moons: ["Qdrant", "Embeddings", "MMR"],
  },
  {
    id: "documents",
    label: "Documents & OCR",
    moons: ["pytesseract", "pdf2image", "rapidfuzz"],
  },
  {
    id: "languages",
    label: "Languages",
    moons: ["Python", "Java", "PHP", "TypeScript", "C", "C++", "PL/SQL"],
  },
  {
    id: "web-frameworks",
    label: "Web Frameworks",
    moons: ["FastAPI", "Flask", "Django", "Uvicorn", "Spring Boot", "Symfony"],
  },
  {
    id: "frontend",
    label: "Frontend",
    moons: ["Next.js", "React", "Tailwind", "HTML/CSS"],
  },
  {
    id: "databases",
    label: "Databases",
    moons: ["PostgreSQL", "MySQL", "SQLite", "H2"],
  },
  {
    id: "orm",
    label: "ORM & Migrations",
    moons: ["SQLAlchemy", "Alembic"],
  },
  {
    id: "platforms",
    label: "Platforms",
    moons: ["Odoo", "Chatwoot", "CTWA", "OpenRemote", "Supabase"],
  },
  {
    id: "cloud-delivery",
    label: "Cloud & Delivery",
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
    moons: ["Grafana", "Loki"],
  },
  {
    id: "systems-networking",
    label: "Systems & Networking",
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
