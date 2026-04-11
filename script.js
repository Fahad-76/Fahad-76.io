// ── Sticky nav active link highlight ──
const navLinks = document.querySelectorAll(".nav-link");

const sections = ["intro", "projects", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => {
    const isMatch = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", isMatch);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  },
  { root: null, rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

sections.forEach((sec) => observer.observe(sec));
if (sections.length) setActive(sections[0].id);

// ── Projects data ──
const projects = [
  {
    title: "Marketplace",
    date: "Mar – Apr 2026",
    badge: "Full-Stack",
    summary: "Multi-vendor e-commerce platform with polyglot persistence, role-partitioned APIs, real-time SignalR events, and a containerised CI/CD pipeline.",
    tech: ["C#", ".NET 10", "Angular", "SQL Server", "MongoDB", "Docker", "SignalR", "JWT", "GitHub Actions"],
    bullets: [
      "Architected a multi-vendor e-commerce platform on a layered ASP.NET Core backend with a polyglot persistence strategy, using SQL Server for transactional data and MongoDB for flexible catalog storage.",
      "Designed a role-partitioned REST API (Buyer, Seller, Admin) with JWT-based stateless authentication, enabling independent scaling of each domain without session affinity constraints.",
      "Modelled order lifecycle as an explicit finite state machine (Pending → Paid → Fulfilled → Cancelled), enforcing valid state transitions at the domain layer with optimistic concurrency control.",
      "Introduced a real-time event layer via SignalR WebSockets to decouple stock update propagation from the request cycle, pushing inventory and notification events to clients without polling overhead.",
      "Separated read and write concerns across buyer, seller, and admin Angular dashboards, structuring the frontend around domain-specific data flows rather than a single monolithic view layer.",
      "Designed a containerised deployment topology using Docker Compose, defining service boundaries, inter-container networking, and volume management to mirror production environment parity locally.",
      "Built a CI/CD pipeline in GitHub Actions with integration tests running against live SQL Server and MongoDB containers, validating persistence logic against real engines rather than mocks.",
      "Published versioned images to GitHub Container Registry as build artifacts, enabling reproducible deployments and clear promotion paths across environments."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/Online-Shop-System.git" }
    ]
  },
  {
    title: "F1 Race Predictor",
    date: "Mar 2026",
    badge: "ML",
    summary: "ML pipeline achieving 0.974 ROC-AUC across 17 blind test races, backed by a live Next.js dashboard with Monte Carlo win-probability estimates.",
    tech: ["Python", "Next.js", "TypeScript", "Supabase", "Vercel", "Random Forest", "Monte Carlo"],
    bullets: [
      "Built an end-to-end race prediction pipeline achieving 0.974 ROC-AUC on a fully blind 2025 test season by training two Random Forest classifiers on 7 seasons of FastF1 API data.",
      "Engineered delta-to-session-leader features to improve cross-season generalisation, reducing GridPosition feature dominance from 78% to 37% for meaningful pace comparison across circuits.",
      "Eliminated temporal data leakage by implementing season-based train/test splits, ensuring all model evaluation reflects true blind prediction on unseen future races.",
      "Modelled driver competition as a dependent probability problem via 1,000 Monte Carlo simulations per race, correctly normalising win probabilities across the 20-driver field.",
      "Correctly predicted the race winner in 10 of 17 races during the 2025 season from pre-race data alone.",
      "Designed a normalised PostgreSQL schema on Supabase persisting telemetry, engineered features, and simulation output across 123 races and 2,400+ driver sessions.",
      "Developed and deployed a full-stack Next.js (TypeScript) dashboard on Vercel with GitHub-integrated CI/CD, displaying live driver win probabilities and podium chances from Supabase."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/F1-Race-Predictor" },
      { label: "Live Demo", url: "https://f1-prediction-dashboard-flax.vercel.app/" }
    ]
  },
  {
    title: "FPGA Particle Filter Acceleration",
  date: "Feb - Apr 2026",
  badge: "FPGA / HLS",
  summary: "Accelerated a probabilistic particle filter on FPGA using Vivado HLS, achieving 40–68× latency reduction over baseline through four successive optimisation stages.",
  tech: ["Vivado HLS", "FPGA", "AXI", "C / HLS C++", "Pipelining", "Memory Coalescing"],
  bullets: [
    "Implemented a particle filter likelihood kernel in HLS C++ targeting FPGA, verified for functional correctness against the original OpenMP C baseline.",
    "Applied load-compute-store decomposition with local buffering to eliminate pointer aliasing, enabling the HLS scheduler to resolve memory access patterns",
    "Introduced loop flattening, 8× unrolling, cyclic array partitioning (factor=8), and II=1 pipelining on the compute stage, collapsing the nested particle/neighbour loops into a single flat pipeline and reducing latency.",
    "Added AXI master burst interfaces (max burst length 256) on separate memory bundles for inputs and outputs, replacing thousands of individual AXI transactions with coalesced bursts — recovering 1.04 ns of timing slack lost in the prior stage.",
    "Implemented ping-pong double buffering with 2D local arrays, allowing load(), compute(), and store() to operate on opposite banks simultaneously across frames.",
  ],
  links: []
},
  {
    title: "Vector ALU Design & Power Analysis",
    date: "Jan – Feb 2026",
    badge: "ASIC / RTL",
    summary: "Parameterized 8-lane × 32-bit vector ALU synthesized through a full ASIC flow, with back-annotated power analysis revealing real switching activity impact.",
    tech: ["Verilog", "SystemVerilog", "ASIC Synthesis", "VCD / SAIF", "Power Analysis"],
    bullets: [
      "Designed a parameterized 8-lane × 32-bit vector ALU supporting 8 operations (ADD, SUB, MUL, ABS, MIN, MAX, AND, OR) with fully synchronous registered outputs.",
      "Developed a comprehensive SystemVerilog testbench verifying all opcodes, signed operands, reset behavior, and lane packing/unpacking.",
      "Synthesized the design and analyzed area (37k µm², 46.4K gates) and timing across frequency scaling.",
      "Identified optimal operating region (100–125 MHz) by evaluating trade-offs between area, timing, and dynamic power.",
      "Performed back-annotated power analysis (VCD/SAIF), revealing ~28.6 mW dynamic power vs 0.3 mW estimated, highlighting the impact of real switching activity.",
      "Analyzed the critical path (register → result datapath) and determined combinational logic contributes ~99% of power consumption, dominated by arithmetic and comparison units."
    ],
    links: []
  },
  {
    title: "Standard Cell Library & ASIC Comparison",
    date: "Jan – Feb 2026",
    badge: "ASIC / HSPICE",
    summary: "Custom standard cell libraries designed and characterized in HSPICE, then benchmarked against an optimized reference library across area, timing, and power.",
    tech: ["HSPICE", "ASIC Synthesis", "Standard Cells", "Digital Flow", "Power Analysis"],
    bullets: [
      "Developed and characterized custom standard cell libraries (X1, X1+X4) using HSPICE and integrated them into a synthesis flow.",
      "Benchmarked against a reference library, demonstrating 54×–87× area overhead due to limited gate diversity and lack of complex cells.",
      "Analyzed timing performance, showing near-critical slack (~0.01 ns) in custom libraries vs comfortable margins in the optimized library.",
      "Quantified dynamic power increase (up to 5×) caused by higher cell count, increased switching capacitance, and deeper logic paths.",
      "Identified limitations in custom libraries including restricted drive strengths, poor logic factorization, and pessimistic delay characteristics.",
      "Evaluated leakage trends and determined comparisons were inconclusive due to simplified SPICE-based leakage modeling.",
      "Demonstrated how library richness directly impacts synthesis quality, area efficiency, timing closure, and power consumption."
    ],
    links: []
  },
  {
    title: "Embedded Systems",
    date: "Sep – Dec 2025",
    badge: "Embedded",
    summary: "Embedded Linux applications on BeagleY-AI interfacing with LEDs, joystick, accelerometer, and rotary encoder via cross-compilation and multithreading.",
    tech: ["C", "Multithreading", "Cross-Compilation", "GPIO / I/O", "BeagleY-AI", "Linux"],
    bullets: [
      "Developed embedded applications interfacing with LEDs, a joystick, an accelerometer, and a rotary encoder deployed on a BeagleY-AI board using Linux cross-compilation.",
      "Implemented a reaction timer using joystick input and LED output, requiring precise input detection and timing validation.",
      "Designed modular embedded software and performed iterative testing and debugging to ensure reliable hardware–software interaction."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/Ensc351-Reaction_game" }
    ]
  },
  {
    title: "Neural Network Optimisation",
    date: "Sep – Dec 2025",
    badge: "Deep Learning",
    summary: "Finetuned ResNet18 on CIFAR-10 then applied quantization and pruning to evaluate the accuracy vs. resource usage trade-off.",
    tech: ["Python", "PyTorch", "Quantization", "Pruning", "Jupyter Notebook"],
    bullets: [
      "Fine-tuned ResNet-18 and VGG16-BN on CIFAR-10 using pretrained ImageNet weights with selective layer unfreezing, achieving >90% baseline accuracy.",
      "Reduced ResNet-18 model size 16× (44.81MB → 2.79MB) and latency 6× (83.34ms → 13.56ms) via QAT + structured channel pruning, maintaining 87.26% accuracy.",
      "Identified QAT + pruning as the optimal compression strategy for edge deployment through systematic analysis of quantization techniques (dynamic PTQ, static PTQ, QAT) and accuracy/latency trade-offs."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/Optimisation-of-Neural-Networks-Quantization-and-Pruning-" }
    ]
  },
  {
    title: "RISC-V Emulator",
    date: "May – Aug 2025",
    badge: "Architecture",
    summary: "Cycle-accurate 5-stage pipelined RISC-V CPU simulator with cache organisation, built for step-by-step instruction debugging.",
    tech: ["C", "RISC-V", "Pipelined Datapaths"],
    bullets: [
      "Implemented a 5-stage cycle-accurate RISC-V CPU simulator with a pipelined data path and cache organisation.",
      "Designed for step-by-step debugging and correctness testing against known instruction sequences."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/254-Project" }
    ]
  },
  {
    title: "RAG Chatbot",
    date: "Sep 2025",
    badge: "AI Systems",
    summary: "Retrieval-Augmented Generation chatbot over PDF documents using LangChain, ChromaDB embeddings, and a Gradio web interface.",
    tech: ["Python", "LangChain", "ChromaDB", "OpenAI API", "Gradio"],
    bullets: [
      "Implemented a Retrieval-Augmented Generation chatbot in Python using LangChain, OpenAI, and Chroma libraries.",
      "Loaded a PDF into LangChain, split the document into chunks, and generated vector embeddings stored in ChromaDB.",
      "Built a RAG query pipeline and deployed the chatbot on a Gradio web interface."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Fahad-76/RAG-chatbot-with-Langchain" }
    ]
  }
];

// ── Render project cards ──
const grid = document.getElementById("projectsGrid");

projects.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "proj-card";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `View details for ${p.title}`);

  const visibleTech = p.tech.slice(0, 4);
  const extraCount = p.tech.length - visibleTech.length;

  card.innerHTML = `
    <div class="proj-card-top">
      <span class="proj-card-title">${p.title}</span>
      <span class="proj-badge">${p.badge}</span>
    </div>
    <p class="proj-date">${p.date}</p>
    <p class="proj-summary">${p.summary}</p>
    <div class="proj-tech-row">
      ${visibleTech.map(t => `<span class="proj-tech-pill">${t}</span>`).join("")}
      ${extraCount > 0 ? `<span class="proj-tech-pill">+${extraCount} more</span>` : ""}
    </div>
    <span class="proj-arrow" aria-hidden="true">↗</span>
  `;

  card.addEventListener("click", () => openModal(i));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openModal(i);
  });
  grid.appendChild(card);
});

// ── Modal logic ──
const overlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");

function openModal(i) {
  const p = projects[i];

  const linksHtml = p.links.length
    ? `<div class="modal-links-row">
        ${p.links.map(l => `
          <a class="modal-link-btn" href="${l.url}" target="_blank" rel="noopener noreferrer">
            ${l.label} ↗
          </a>`).join("")}
       </div>`
    : "";

  modalContent.innerHTML = `
    <h2 class="modal-title">${p.title}</h2>
    <div class="modal-meta">
      <span class="proj-badge">${p.badge}</span>
      <span class="modal-date-text">${p.date}</span>
    </div>
    <div class="modal-section">
      <p class="modal-section-label">Overview</p>
      <p class="modal-overview">${p.summary}</p>
    </div>
    <div class="modal-section">
      <p class="modal-section-label">Details</p>
      <ul class="modal-bullets">
        ${p.bullets.map(b => `<li>${b}</li>`).join("")}
      </ul>
    </div>
    <div class="modal-section">
      <p class="modal-section-label">Technologies</p>
      <div class="modal-tech-row">
        ${p.tech.map(t => `<span class="proj-tech-pill">${t}</span>`).join("")}
      </div>
    </div>
    ${linksHtml}
  `;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });