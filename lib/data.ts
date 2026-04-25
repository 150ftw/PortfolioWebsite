// ─────────────────────────────────────────────────────────
// ALL content lives here. Components are pure layout.
// ─────────────────────────────────────────────────────────

export const owner = {
  name: "Shivam Sharma",
  firstName: "SHIVAM",
  lastName: "SHARMA",
  roles: [
    "Full-Stack Developer",
    "AI Builder",
    "Web3 Explorer",
    "Co-Founder",
  ],
  roleLine: "FULL-STACK DEVELOPER · AI BUILDER · CO-FOUNDER",
  location: "Gurugram, India",
  email: "ss18244646@gmail.com",
  phone: "+91 96675 10634",
  github: "https://github.com/150ftw",
  linkedin: "https://www.linkedin.com/in/shivam-sharma-331945284/",
  discord: "https://discord.com/users/453869754944585738",
  instagram: "https://www.instagram.com/shiv_mmm/",
  bio: "I build AI-powered products at the intersection of finance and technology. Co-founder of EcoInsight.AI — an AI-driven stock analytics platform for retail investors. I work across the full stack with deep focus on Web3/Solidity, RAG pipelines, Docker, and AWS.",
  aboutBio:
    "Co-founder, builder, and product-minded engineer based out of Gurugram. My work sits at the seam where finance meets machine intelligence — RAG pipelines that reason over market data, retrieval systems that turn raw filings into decisions, and interfaces that make it all feel inevitable.",
};

export type Stat = {
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { value: "3+", label: "YEARS" },
  { value: "10+", label: "PROJECTS" },
  { value: "1", label: "STARTUP" },
  { value: "∞", label: "CURIOSITY" },
];

export type Project = {
  number: string;
  name: string;
  accent?: string;
  tagline: string;
  description: string;
  stack: string[];
  bg: "navy" | "ink" | "paper" | "surface";
  layout: "left" | "right";
  featured?: boolean;
  image?: string;
  github?: string;
  live?: string;
  year?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "CALMSPHERE",
    accent: "AI",
    tagline: "AI-POWERED MENTAL WELLNESS",
    description:
      "An AI assistant that provides personalized emotional support, stress analysis, and guided coping strategies through intelligent conversation. Built around a fine-tuned conversational layer and a safety-first prompt architecture.",
    stack: ["Python", "OpenAI API", "React", "Node.js", "Firebase", "NLP"],
    bg: "navy",
    layout: "left",
    featured: true,
    year: "2025",
    image: "/images/projects/calmsphere.png",
    github: "https://github.com/150ftw/CalmSphere",
    live: "https://frontend-psi-nine-32.vercel.app",
  },
  {
    number: "02",
    name: "ECOINSIGHT",
    accent: "AI",
    tagline: "STOCK ANALYTICS FOR RETAIL INVESTORS",
    description:
      "AI-powered stock analytics platform offering market insights, sentiment analysis, and smart investment research tools. Retrieval over filings, news, and price action — piped through an LLM that reasons about conviction.",
    stack: ["Next.js", "RAG", "MongoDB", "AWS", "Docker"],
    bg: "ink",
    layout: "right",
    year: "2025",
    image: "/images/projects/ecoinsight.png",
    github: "https://github.com/150ftw/EcoInsight",
    live: "https://www.ecoinsight.online",
  },
  {
    number: "03",
    name: "WAITLIST",
    accent: "LIVE",
    tagline: "HIGH-CONVERTING LAUNCH PAGE",
    description:
      "A waitlist system engineered to capture early users, validate demand, and compound launch momentum for EcoInsight.AI. Pixel-perfect on every viewport, zero friction on signup.",
    stack: ["Next.js", "React", "Tailwind CSS", "Firebase"],
    bg: "paper",
    layout: "left",
    year: "2024",
    image: "/images/projects/waitlist.png",
    github: "https://github.com/150ftw/EcoInsightWaitList",
    live: "https://www.joinecoinsight.dev",
  },
  {
    number: "04",
    name: "SOLAR SYSTEM",
    accent: "3D",
    tagline: "INTERACTIVE ORBITAL SIMULATION",
    description:
      "A real-time 3D visualization of planetary motion and orbital mechanics. WebGL shaders, accurate scale, and intuitive controls for exploring scale-model physics.",
    stack: ["Three.js", "JavaScript", "WebGL"],
    bg: "ink",
    layout: "left",
    year: "2024",
    image: "/images/projects/solarsystem.png",
    github: "https://github.com/150ftw/Solar-System-Explorer",
    live: "https://3d-solar-system-three-js.vercel.app",
  },
  {
    number: "05",
    name: "ACADEMIQ",
    accent: "CLOUD",
    tagline: "ACADEMIC RESULTS, AUTOMATED",
    description:
      "Cloud-based academic result management system — automated generation, secure storage, and performance analytics for educational institutions at scale.",
    stack: ["Python", "Firebase", "Cloud", "JavaScript"],
    bg: "surface",
    layout: "right",
    year: "2023",
    image: "/images/projects/academiq.png",
    github: "https://github.com/150ftw/Automated-Result-Management-System",
    live: "https://academiqq.vercel.app",
  },
];

export type SkillRow = {
  direction: "left" | "right";
  speed: "slow" | "fast";
  items: { name: string; context: string }[];
};

export const skillRows: SkillRow[] = [
  {
    direction: "right",
    speed: "slow",
    items: [
      { name: "REACT", context: "Component-driven UIs at production scale" },
      { name: "NEXT.JS", context: "App Router, server components, streaming SSR" },
      { name: "TYPESCRIPT", context: "Strict mode, inferred generics, type-safe APIs" },
      { name: "TAILWIND", context: "Design systems without the bloat" },
      { name: "FRAMER MOTION", context: "Physics-based animation & shared layouts" },
    ],
  },
  {
    direction: "left",
    speed: "fast",
    items: [
      { name: "NODE.JS", context: "Event-driven servers, async I/O, streaming" },
      { name: "EXPRESS", context: "Battle-tested REST APIs and middleware" },
      { name: "MONGODB", context: "Document-first schemas and aggregation pipelines" },
      { name: "POSTGRESQL", context: "Relational rigor, JSONB, indexing strategy" },
      { name: "REST APIs", context: "Versioning, pagination, auth boundaries" },
    ],
  },
  {
    direction: "right",
    speed: "slow",
    items: [
      { name: "SOLIDITY", context: "Smart contract development on EVM chains" },
      { name: "ETHERS.JS", context: "Wallet plumbing, transaction crafting, RPC" },
      { name: "HARDHAT", context: "Local chains, fork tests, deploy scripts" },
      { name: "IPFS", context: "Content-addressed storage for on-chain assets" },
      { name: "WEB3", context: "Decentralized protocols, tokens, wallets" },
    ],
  },
  {
    direction: "left",
    speed: "fast",
    items: [
      { name: "LANGCHAIN", context: "Agents, tool-use, chain composition" },
      { name: "RAG PIPELINES", context: "Retrieval-augmented generation, end to end" },
      { name: "OPENAI", context: "GPT APIs, function calling, structured outputs" },
      { name: "VECTOR DBS", context: "Pinecone, Weaviate, pgvector at scale" },
      { name: "PYTHON", context: "Async services, data pipelines, scripting glue" },
    ],
  },
  {
    direction: "right",
    speed: "slow",
    items: [
      { name: "DOCKER", context: "Multi-stage builds, slim images, compose" },
      { name: "AWS", context: "EC2, S3, Lambda, CloudFront, Route53" },
      { name: "GITHUB ACTIONS", context: "Opinionated CI/CD pipelines" },
      { name: "VERCEL", context: "Edge deployments, preview environments" },
      { name: "LINUX", context: "Daily driver — shell, systemd, networking" },
    ],
  },
];

export type BlogPost = {
  number: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  accent: "acid" | "danger";
};

export const blogPosts: BlogPost[] = [
  {
    number: "01",
    title: "Building a Production RAG Pipeline from Scratch",
    excerpt:
      "A field guide to retrieval-augmented generation — from chunking strategies to reranking, grounding, and the unsexy plumbing that turns a demo into a product.",
    category: "AI / ENG",
    readTime: "12 MIN READ",
    accent: "acid",
  },
  {
    number: "02",
    title: "Why Retail Investors Need AI-Powered Analytics",
    excerpt:
      "The information asymmetry between institutions and retail is closing — not with data, but with the models that make sense of it.",
    category: "FINANCE",
    readTime: "8 MIN READ",
    accent: "danger",
  },
  {
    number: "03",
    title: "Getting Started with Solidity: A Developer's Guide",
    excerpt:
      "A builder's path into EVM smart contracts — gas, storage, reentrancy, and the mental model you actually need.",
    category: "WEB3",
    readTime: "10 MIN READ",
    accent: "acid",
  },
];

export type NavSection = {
  id: string;
  label: string;
  number: string;
};

export const navSections: NavSection[] = [
  { id: "hero", label: "INDEX", number: "00" },
  { id: "about", label: "ABOUT", number: "01" },
  { id: "skills", label: "SKILLS", number: "02" },
  { id: "blog", label: "JOURNAL", number: "03" },
  { id: "contact", label: "CONTACT", number: "04" },
];

export const terminalLines: { prompt: string; output: string }[] = [
  {
    prompt: "shivam@portfolio ~ $ whoami",
    output: "Shivam Sharma — Builder of things",
  },
  {
    prompt: "shivam@portfolio ~ $ cat stack.txt",
    output: "MERN · Next.js · Solidity · RAG · Docker · AWS",
  },
  {
    prompt: "shivam@portfolio ~ $ echo $MISSION",
    output: "Democratizing financial intelligence",
  },
];
