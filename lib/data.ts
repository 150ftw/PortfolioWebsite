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
  coords: "28.4147° N, 77.0884° E",
  dob: "24 April 2004",
  age: 22,
  email: "ss18244646@gmail.com",
  phone: "+91 96675 10634",
  github: "https://github.com/150ftw",
  linkedin: "https://www.linkedin.com/in/shivam-sharma-331945284/",
  resume: "https://drive.google.com/file/d/1A5YhiQ7tkVYGrJHLcmledmJmo6Tja8Z8/view?usp=sharing",
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
  deepScan?: {
    architecture: string[];
    performance: { label: string; value: string }[];
    logs: string[];
  };
};

export const projects: Project[] = [
  {
    number: "01",
    name: "ECOINSIGHT",
    accent: "AI",
    tagline: "STOCK ANALYTICS FOR RETAIL INVESTORS",
    description:
      "AI-powered stock analytics platform offering market insights, sentiment analysis, and smart investment research tools. Retrieval over filings, news, and price action — piped through an LLM that reasons about conviction.",
    stack: ["Next.js", "RAG", "MongoDB", "AWS", "Docker"],
    bg: "ink",
    layout: "left",
    year: "2025",
    image: "/images/projects/ecoinsight.png",
    github: "https://github.com/150ftw/EcoInsight",
    live: "https://www.ecoinsight.online",
    deepScan: {
      architecture: ["Vector Database (Pinecone)", "RAG Pipeline", "Next.js Edge", "AWS Lambda"],
      performance: [
        { label: "Retrieval Latency", value: "< 200ms" },
        { label: "Inference Speed", value: "85 t/s" },
        { label: "Accuracy", value: "94.2%" },
      ],
      logs: [
        "INITIALIZING_RAG_PIPELINE...",
        "CONNECTING_VECTOR_STORE_PRIMARY...",
        "CHUNKING_STRATEGY: RECURSIVE_CHARACTER",
        "EMBEDDING_MODEL: TEXT-EMBEDDING-3-SMALL",
        "SYSTEM_READY_FOR_INFERENCE",
      ],
    },
  },
  {
    number: "02",
    name: "ECOINSIGHT",
    accent: "WAITLIST",
    tagline: "HIGH-CONVERTING LAUNCH PAGE",
    description:
      "A waitlist system engineered to capture early users, validate demand, and compound launch momentum for EcoInsight.AI. Pixel-perfect on every viewport, zero friction on signup.",
    stack: ["Next.js", "React", "Tailwind CSS", "Firebase"],
    bg: "paper",
    layout: "right",
    year: "2024",
    image: "/images/projects/waitlist.png",
    github: "https://github.com/150ftw/EcoInsightWaitList",
    live: "https://www.joinecoinsight.dev",
    deepScan: {
      architecture: ["Next.js App Router", "Firebase Auth", "Firestore DB", "Tailwind CSS"],
      performance: [
        { label: "Lighthouse Score", value: "100" },
        { label: "Conversion Rate", value: "12.5%" },
        { label: "Load Time", value: "0.8s" },
      ],
      logs: [
        "HYDRATING_WAITLIST_COMPONENT...",
        "FETCHING_EARLY_ADOPTER_COUNT...",
        "FIREBASE_CONNECTION_ESTABLISHED",
        "ANALYTICS_EVENT: PAGE_VIEW_WAITLIST",
      ],
    },
  },
  {
    number: "03",
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
    deepScan: {
      architecture: ["FastAPI Backend", "Fine-tuned GPT-4o", "React Frontend", "Vector Memory"],
      performance: [
        { label: "Sentiment Accuracy", value: "91%" },
        { label: "Response Delay", value: "1.2s" },
        { label: "Safety Score", value: "99.9%" },
      ],
      logs: [
        "BOOTING_THERAPEUTIC_AGENT...",
        "LOADING_CONVERSATIONAL_CONTEXT...",
        "SAFETY_LAYER_ACTIVE",
        "INFERENCE_ENGINE_SYNCED",
      ],
    },
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
    layout: "right",
    year: "2024",
    image: "/images/projects/solarsystem.png",
    github: "https://github.com/150ftw/Solar-System-Explorer",
    live: "https://3d-solar-system-three-js.vercel.app",
    deepScan: {
      architecture: ["Three.js Scene Graph", "Custom Shaders", "Physics Engine", "WebGL 2.0"],
      performance: [
        { label: "Frame Rate", value: "60 FPS" },
        { label: "Draw Calls", value: "124" },
        { label: "GPU Load", value: "15%" },
      ],
      logs: [
        "INITIALIZING_WEBGL_CONTEXT...",
        "COMPILING_PLANETARY_SHADERS...",
        "CALCULATING_KEPLERIAN_ORBITS...",
        "SCENE_GRAPH_STABLE",
      ],
    },
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
    layout: "left",
    year: "2023",
    image: "/images/projects/academiq.png",
    github: "https://github.com/150ftw/Automated-Result-Management-System",
    live: "https://academiqq.vercel.app",
    deepScan: {
      architecture: ["Python Flask API", "Firebase Storage", "Vercel Hosting", "Auth0"],
      performance: [
        { label: "Report Gen Time", value: "2s" },
        { label: "Database Latency", value: "45ms" },
        { label: "Storage Capacity", value: "10TB+" },
      ],
      logs: [
        "SYNCING_ACADEMIC_RECORDS...",
        "GENERATING_PDF_REPORTS...",
        "STORAGE_UPLINK_STABLE",
        "ENCRYPTION_LAYER_ACTIVE",
      ],
    },
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
  content: string;
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
    content: `
Retrieval-Augmented Generation (RAG) has moved from a research novelty to a production necessity. But the gap between a "Hello World" notebook and a production-grade system is vast.

### The Problem of Context
Most RAG demos fail because they treat retrieval as a simple search. In production, you need to consider chunking strategies that preserve semantic meaning. Are you using fixed-size windows? Overlapping sentences? Or recursively splitting based on document structure?

### The Chunking Strategy
We found that recursive character splitting works best for technical documentation. It respects paragraph boundaries, ensuring that code blocks and their explanations stay together.

### Reranking: The Secret Sauce
Vector search is great at broad retrieval, but it lacks the nuance for precision. Implementing a reranker (like Cohere or a local Cross-Encoder) can significantly improve the grounding of your LLM responses.

### Conclusion
Building a RAG pipeline is 20% AI and 80% plumbing. Focus on the data quality and the retrieval precision, and the LLM will take care of the rest.
    `,
    category: "AI / ENG",
    readTime: "12 MIN READ",
    accent: "acid",
  },
  {
    number: "02",
    title: "Why Retail Investors Need AI-Powered Analytics",
    excerpt:
      "The information asymmetry between institutions and retail is closing — not with data, but with the models that make sense of it.",
    content: `
The financial world has always been a battle of information. For decades, institutional investors had the upper hand, thanks to expensive Bloomberg terminals and teams of analysts.

### The Democratization of Data
Data is no longer the moat. Financial filings, news, and price action are now accessible to everyone. The new moat is the ability to process and reason over that data at scale.

### Enter AI-Driven Reasoning
Traditional analytics give you charts. AI-driven analytics give you conviction. By using LLMs to reason over thousands of pages of earnings transcripts, retail investors can finally spot the patterns that were previously hidden in the noise.

### The Future of Investing
We are moving toward a world where every retail investor has a "quant team" in their pocket. This doesn't mean AI makes the decisions—it means AI provides the synthesized intelligence for humans to make better ones.
    `,
    category: "FINANCE",
    readTime: "8 MIN READ",
    accent: "danger",
  },
  {
    number: "03",
    title: "Getting Started with Solidity: A Developer's Guide",
    excerpt:
      "A builder's path into EVM smart contracts — gas, storage, reentrancy, and the mental model you actually need.",
    content: `
Solidity is a deceptively simple language. It looks like JavaScript, but it behaves like a bomb disposal manual. Every line has a cost, and every mistake is permanent.

### The Storage Paradox
In traditional dev, memory is cheap. In Solidity, storage is the most expensive thing you can do. Understanding the difference between 'memory', 'storage', and 'calldata' is the first step to becoming a senior smart contract engineer.

### Security First
Reentrancy is the classic bug, but there are dozens of others: integer overflows (pre-0.8.0), front-running, and logic errors in access control. Auditing your own code starts with a "paranoid" mental model.

### Gas Optimization
Writing code is easy. Writing gas-efficient code is an art. Pack your variables, use events for off-chain data, and avoid loops like the plague.
    `,
    category: "WEB3",
    readTime: "10 MIN READ",
    accent: "acid",
  },
  {
    number: "04",
    title: "The Future of Agentic Workflows in Enterprise",
    excerpt:
      "Beyond simple chatbots — how autonomous agents are beginning to handle complex, multi-step business logic and decision-making pipelines.",
    content: `
Agentic workflows are the next evolution of AI. Instead of a single LLM call, we are building systems that can plan, execute, and reflect on their own work.
    `,
    category: "AI / ENG",
    readTime: "15 MIN READ",
    accent: "danger",
  },
  {
    number: "05",
    title: "Scaling Next.js Apps with Edge Functions",
    excerpt:
      "Why the edge is the future of the web. A deep dive into middleware, streaming SSR, and low-latency data fetching at the global scale.",
    content: `
Next.js Edge Functions allow you to run code closer to your users. This is critical for low-latency AI applications and dynamic content delivery.
    `,
    category: "DEV",
    readTime: "9 MIN READ",
    accent: "acid",
  },
  {
    number: "06",
    title: "DeFi 2.0: Lessons from the Liquidity Crunch",
    excerpt:
      "An analysis of protocol-owned liquidity, yield optimization strategies, and the systemic risks that defined the second wave of decentralized finance.",
    content: `
DeFi 2.0 attempted to solve the liquidity problem. While some protocols failed, the lessons learned are shaping the next generation of financial primitives.
    `,
    category: "WEB3",
    readTime: "11 MIN READ",
    accent: "danger",
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
