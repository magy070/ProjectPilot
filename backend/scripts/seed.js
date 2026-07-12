import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';

dotenv.config();

const projects = [
  {
    name: "AI-Powered Mental Health Companion",
    description: "An empathetic conversational agent that utilizes Natural Language Processing (NLP) to provide daily mental health support, sentiment tracking, and guided meditation suggestions.",
    problemStatement: "Traditional therapy is expensive and lacks 24/7 immediate accessibility, leaving many individuals struggling with daily stress and anxiety without early-intervention support.",
    objectives: [
      "Implement sentiment analysis on user journal entries.",
      "Design a conversational chatbot with therapeutic guidelines.",
      "Track emotional trends over weekly/monthly timelines."
    ],
    features: [
      "Real-time journaling with live sentiment highlights.",
      "Empathetic chatbot powered by deep learning chat APIs.",
      "Interactive mood trends dashboard.",
      "Stress relief micro-activities and recommendations."
    ],
    techStack: ["React", "Tailwind CSS", "Express", "MongoDB", "Python", "Transformers"],
    requiredSkills: ["React", "Node.js", "Python", "NLP Concepts"],
    difficulty: "Advanced",
    estimatedTime: "2 Months",
    resumeValue: "High: Demonstrates mastery over modern NLP models and full-stack data visualization structures.",
    feasibilityScore: 85,
    teamSize: 2,
    domain: "AI/ML"
  },
  {
    name: "Decentralized Voting System",
    description: "A secure, transparent, and tamper-proof electronic voting application built on Ethereum smart contracts to ensure reliable election outcomes.",
    problemStatement: "Centralized voting databases are vulnerable to security breaches, inside manipulation, and lack transparent verification paths for voters.",
    objectives: [
      "Develop secure Solidity smart contracts for ballot management.",
      "Integrate MetaMask for user authentication.",
      "Implement real-time vote aggregation without double-spend."
    ],
    features: [
      "MetaMask login integration.",
      "Unique ballot token distribution.",
      "Real-time tamper-proof voting statistics.",
      "Public verification ledgers."
    ],
    techStack: ["React", "Solidity", "Hardhat", "Ethers.js", "Tailwind CSS"],
    requiredSkills: ["React", "Solidity", "Web3 Fundamentals"],
    difficulty: "Advanced",
    estimatedTime: "1 Month",
    resumeValue: "Very High: Focuses on blockchain protocol implementation, cryptography, and modern smart contract testing.",
    feasibilityScore: 75,
    teamSize: 1,
    domain: "Blockchain"
  },
  {
    name: "Smart IoT Home Dashboard",
    description: "A centralized dashboard to monitor and orchestrate smart home appliances, tracking temperature, power consumption, and security sensors.",
    problemStatement: "Fragmented ecosystems of smart home devices leave users jumping between different apps without a unified command interface.",
    objectives: [
      "Establish a mock Raspberry Pi sensor emulator.",
      "Implement MQTT connection protocol for low-latency notifications.",
      "Build interactive dashboard controls."
    ],
    features: [
      "Unified controller toggles (lights, locks, climate).",
      "Real-time temperature and wattage logging graphs.",
      "Emergency push-notification alerts.",
      "Device health status indicators."
    ],
    techStack: ["React", "Node.js", "MQTT Broker", "Chart.js", "MongoDB"],
    requiredSkills: ["React", "Node.js", "WebSockets"],
    difficulty: "Intermediate",
    estimatedTime: "1 Month",
    resumeValue: "High: Proves competency in real-time streaming data ingestion and system level control integrations.",
    feasibilityScore: 90,
    teamSize: 2,
    domain: "IoT"
  },
  {
    name: "ProjectPilot (AI Recommendations & Planners)",
    description: "An AI-powered roadmap planner and recommendation engine helping developers and students organize project milestones, generate synopses, and build developer prompts.",
    problemStatement: "Students struggle with brainstorming feasible software project scopes, leaving them stuck in planning phases without execution layouts.",
    objectives: [
      "Develop skill-matching recommendation queries.",
      "Implement swappable AI services for automated templates.",
      "Build timeline-based development roadmaps."
    ],
    features: [
      "Profile-matched feasibility score indicators.",
      "AI-driven synopsis and copy-paste prompts generators.",
      "Side-by-side comparative project layouts.",
      "Timeline roadmap visualizer."
    ],
    techStack: ["React", "Tailwind CSS", "Node.js", "Mongoose", "Gemini API"],
    requiredSkills: ["React", "Node.js", "API Integrations", "MongoDB"],
    difficulty: "Intermediate",
    estimatedTime: "1 Month",
    resumeValue: "High: Demonstrates standard full-stack expertise along with advanced LLM prompting abstractions.",
    feasibilityScore: 95,
    teamSize: 3,
    domain: "Web Dev"
  },
  {
    name: "Encrypted Cloud Storage Manager",
    description: "A secure file manager that encrypts files on the client side before uploading them to cloud storage services, ensuring zero-knowledge privacy.",
    problemStatement: "Cloud storage providers can access files, exposing sensitive user data to corporate leaks or government surveillance.",
    objectives: [
      "Implement Web Crypto API for AES-GCM client encryption.",
      "Set up file upload interfaces.",
      "Create key derivation functions from user passwords."
    ],
    features: [
      "Drag-and-drop secure file upload.",
      "Client-side encryption and decryption.",
      "Secure shareable download link generator.",
      "Local key backup vault."
    ],
    techStack: ["React", "Express", "Mongoose", "Web Crypto API"],
    requiredSkills: ["React", "Node.js", "Cryptography"],
    difficulty: "Advanced",
    estimatedTime: "1 Month",
    resumeValue: "Extremely High: Showcases deep security expertise, key management knowledge, and complex file streaming.",
    feasibilityScore: 80,
    teamSize: 1,
    domain: "Cybersecurity"
  },
  {
    name: "Multi-Cloud Resource Manager",
    description: "An orchestration tool that monitors, compares costs, and provisions basic cloud resources across AWS, GCP, and Azure using a single dashboard.",
    problemStatement: "DevOps teams struggle to manage multi-cloud costs and resources, causing server waste and high monthly bills.",
    objectives: [
      "Build simple AWS and GCP mock provision APIs.",
      "Calculate comparative server costs based on configurations.",
      "Develop budget alerts and shutdown schedules."
    ],
    features: [
      "Unified dashboard of active VMs across cloud providers.",
      "Real-time cost calculator charts.",
      "Automated low-usage instance alerts.",
      "One-click server spin-down buttons."
    ],
    techStack: ["React", "Express", "Cloud APIs", "Chart.js", "MongoDB"],
    requiredSkills: ["React", "Node.js", "Cloud APIs"],
    difficulty: "Advanced",
    estimatedTime: "2 Months",
    resumeValue: "Outstanding: Reflects advanced DevOps capability and high-scale dashboard design.",
    feasibilityScore: 70,
    teamSize: 2,
    domain: "Cloud"
  },
  {
    name: "Collaborative Real-time Canvas",
    description: "A collaborative virtual whiteboard that allows team members to sketch designs, place sticky notes, and plan sprints in real-time.",
    problemStatement: "Distributed teams lack interactive spaces to visualize system flows during remote brainstorming meetings.",
    objectives: [
      "Implement low-latency HTML5 Canvas drawing synchronize handlers.",
      "Set up Socket.io connection links.",
      "Design layout tools for shapes and text."
    ],
    features: [
      "Real-time drawing canvas synchronization.",
      "Draggable sticky notes and shapes.",
      "Multiple user cursors with nameplates.",
      "Export sketch board to PNG."
    ],
    techStack: ["React", "Socket.io", "HTML5 Canvas", "Express", "MongoDB"],
    requiredSkills: ["React", "Node.js", "WebSockets", "Canvas API"],
    difficulty: "Intermediate",
    estimatedTime: "2 Weeks",
    resumeValue: "High: Showcases real-time event orchestration, frontend canvas performance optimization, and multi-user sync.",
    feasibilityScore: 88,
    teamSize: 2,
    domain: "Web Dev"
  },
  {
    name: "Industrial Predictive Maintenance Engine",
    description: "An AI-powered monitoring tool that ingests industrial machine logs and predicts mechanical failures before they happen.",
    problemStatement: "Sudden machine failures cost industrial businesses billions in downtime, which could be solved with proactive wear-and-tear monitoring.",
    objectives: [
      "Develop a time-series anomaly detection algorithm model.",
      "Create machine logs upload and ingestion pipes.",
      "Render system lifetime forecasts."
    ],
    features: [
      "Live telemetry dashboard charts.",
      "Anomaly detection warning flags.",
      "Days-until-failure indicators.",
      "Maintenance history tracking log."
    ],
    techStack: ["React", "Express", "Python", "Scikit-Learn", "Mongoose", "Pandas"],
    requiredSkills: ["React", "Node.js", "Python", "Machine Learning"],
    difficulty: "Advanced",
    estimatedTime: "2 Months",
    resumeValue: "Very High: Focuses on industrial analytics, ML classification models, and advanced dashboard graphing.",
    feasibilityScore: 78,
    teamSize: 3,
    domain: "AI/ML"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[Seeder] Connected to database. Clearing old projects...");
    await Project.deleteMany({});
    
    console.log("[Seeder] Injecting mock projects...");
    await Project.insertMany(projects);
    
    console.log("[Seeder] Projects database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
