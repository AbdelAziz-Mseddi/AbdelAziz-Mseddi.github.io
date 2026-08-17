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

// Every entry here comes from the confirmed skill inventory (verified
// project usage + LinkedIn skill tags) — nothing invented for the
// visualization. Grouped more granularly than the site's 5 broad content
// lanes (ai-ml, backend, devops, low-level, security), by explicit choice.
//
// Ordering is inside-out by how central the group is to the work: the
// agent/ML planets sit closest to the star, general tooling furthest out.
// Each backend planet is one language and the frameworks that run on it,
// so a language always shares a planet with its own ecosystem.
export const STACK_PLANETS: Planet[] = [
  {
    id: "ai-agents",
    label: "AI & Agents",
    color: "#e0a458",
    orbitRadius: 55,
    orbitSeconds: 24,
    size: 20,
    moons: [
      { name: "LangChain" },
      { name: "LangGraph" },
      { name: "Google ADK" },
      { name: "LiteLLM" },
      { name: "Chatwoot" },
      { name: "CTWA" },
    ],
  },
  {
    id: "ml-retrieval",
    label: "ML & Retrieval",
    color: "#a78bfa",
    orbitRadius: 90,
    orbitSeconds: 30,
    size: 19,
    moons: [
      { name: "Qdrant" },
      { name: "XGBoost" },
      { name: "PyTorch" },
      { name: "ONNX Runtime" },
      { name: "Embeddings" },
      { name: "MMR" },
      { name: "Graph Attention Networks" },
      { name: "Bi-LSTM" },
      { name: "Quantization" },
    ],
  },
  {
    id: "documents-ocr",
    label: "Documents & OCR",
    color: "#d98fc4",
    orbitRadius: 125,
    orbitSeconds: 36,
    size: 16,
    moons: [
      { name: "pytesseract" },
      { name: "pdf2image" },
      { name: "rapidfuzz" },
    ],
  },
  {
    id: "backend-python",
    label: "Backend — Python",
    color: "#5fb8a8",
    orbitRadius: 160,
    orbitSeconds: 42,
    size: 18,
    moons: [
      { name: "Python" },
      { name: "FastAPI" },
      { name: "Flask" },
      { name: "Django" },
      { name: "Uvicorn" },
    ],
  },
  {
    id: "backend-java",
    label: "Backend — Java",
    color: "#c9784f",
    orbitRadius: 195,
    orbitSeconds: 48,
    size: 18,
    moons: [
      { name: "Java" },
      { name: "Spring Boot" },
      { name: "JWT" },
      { name: "Maven" },
    ],
  },
  {
    id: "backend-php",
    label: "Backend — PHP",
    color: "#8f7fd4",
    orbitRadius: 230,
    orbitSeconds: 54,
    size: 16,
    moons: [{ name: "PHP" }, { name: "Symfony" }, { name: "Odoo" }],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "#5b8fd4",
    orbitRadius: 265,
    orbitSeconds: 60,
    size: 17,
    moons: [
      { name: "Next.js" },
      { name: "React" },
      { name: "TypeScript" },
      { name: "Tailwind" },
      { name: "HTML/CSS" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    color: "#7fc9a0",
    orbitRadius: 300,
    orbitSeconds: 66,
    size: 17,
    moons: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "SQLite" },
      { name: "H2" },
      { name: "PL/SQL" },
      { name: "SQLAlchemy" },
      { name: "Alembic" },
    ],
  },
  {
    id: "infra-observability",
    label: "Infra & Observability",
    color: "#8fa3c9",
    orbitRadius: 335,
    orbitSeconds: 72,
    size: 20,
    moons: [
      { name: "Docker" },
      { name: "docker-compose" },
      { name: "GitHub Actions" },
      { name: "Grafana" },
      { name: "Loki" },
      { name: "Nginx" },
      { name: "Google Cloud" },
      { name: "Cloudflare R2" },
      { name: "Supabase" },
    ],
  },
  {
    id: "systems-hardware",
    label: "Systems & Hardware",
    color: "#b0a06a",
    orbitRadius: 370,
    orbitSeconds: 78,
    size: 18,
    moons: [
      { name: "C" },
      { name: "C++" },
      { name: "BSD sockets" },
      { name: "Unix" },
      { name: "Linux" },
      { name: "SSH" },
      { name: "DNS" },
      { name: "Networks" },
      { name: "Saleae Logic" },
      { name: "OpenRemote" },
      { name: "Credential Stuffing Scan" },
    ],
  },
  {
    id: "dev-tooling",
    label: "Dev Tooling",
    color: "#b8b3d9",
    orbitRadius: 405,
    orbitSeconds: 84,
    size: 16,
    moons: [
      { name: "Git" },
      { name: "GitHub Copilot" },
      { name: "Codex" },
      { name: "Claude" },
      { name: "Mermaid" },
      { name: "UML" },
      { name: "Bruno" },
      { name: "Mailpit" },
    ],
  },
];
