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

// Every entry here is pulled from real stack tags across content/projects.json
// (projects + experience) — nothing invented for the visualization.
export const STACK_PLANETS: Planet[] = [
  {
    id: "ai-agents",
    label: "AI & Agents",
    color: "#e0a458",
    orbitRadius: 90,
    orbitSeconds: 26,
    size: 13,
    moons: [
      { name: "Python" },
      { name: "LangChain" },
      { name: "LangGraph" },
      { name: "Google ADK" },
      { name: "LiteLLM" },
      { name: "FastAPI" },
    ],
  },
  {
    id: "ml-retrieval",
    label: "ML & Retrieval",
    color: "#a78bfa",
    orbitRadius: 135,
    orbitSeconds: 34,
    size: 11,
    moons: [
      { name: "Qdrant" },
      { name: "XGBoost" },
      { name: "Graph Attention Networks" },
      { name: "Bi-LSTM" },
    ],
  },
  {
    id: "backend-java",
    label: "Backend — Java",
    color: "#c9784f",
    orbitRadius: 180,
    orbitSeconds: 42,
    size: 12,
    moons: [
      { name: "Spring Boot" },
      { name: "Spring Security" },
      { name: "JWT" },
      { name: "Maven" },
      { name: "H2" },
    ],
  },
  {
    id: "backend-web",
    label: "Backend — Web",
    color: "#5fb8a8",
    orbitRadius: 225,
    orbitSeconds: 50,
    size: 11,
    moons: [
      { name: "Flask" },
      { name: "PHP" },
      { name: "Symfony" },
      { name: "Composer" },
      { name: "UML" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "#5b8fd4",
    orbitRadius: 270,
    orbitSeconds: 58,
    size: 12,
    moons: [
      { name: "Next.js" },
      { name: "React" },
      { name: "TypeScript" },
      { name: "Tailwind" },
    ],
  },
  {
    id: "infra-data",
    label: "Infra & Data",
    color: "#8fa3c9",
    orbitRadius: 315,
    orbitSeconds: 66,
    size: 13,
    moons: [
      { name: "Docker" },
      { name: "MySQL" },
      { name: "Supabase" },
      { name: "Cloudflare R2" },
      { name: "Grafana" },
      { name: "Loki" },
      { name: "Nginx" },
      { name: "Odoo" },
    ],
  },
  {
    id: "systems-hardware",
    label: "Systems & Hardware",
    color: "#c98f6f",
    orbitRadius: 360,
    orbitSeconds: 74,
    size: 11,
    moons: [
      { name: "C" },
      { name: "BSD sockets" },
      { name: "Unix" },
      { name: "Saleae Logic" },
    ],
  },
];
