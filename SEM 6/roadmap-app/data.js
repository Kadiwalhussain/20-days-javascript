const semesterData = [
    {
        code: "CSC601",
        name: "System Programming & Compiler Construction",
        description: "Understanding how software is translated into machine code and the tools involved.",
        modules: [
            {
                id: "csc601-m1",
                title: "Module 1: Introduction to System Software",
                hours: 2,
                topics: [
                    "Concept of System Software: Goals, System program vs System programming",
                    "Overview of System Programs: Assembler, Macro processor, Loader, Linker",
                    "Overview of System Programs: Compiler, Interpreter",
                    "Overview of System Programs: Device Drivers, Operating system",
                    "Overview of System Programs: Editors, Debuggers"
                ]
            },
            {
                id: "csc601-m2",
                title: "Module 2: Assemblers",
                hours: 7,
                topics: [
                    "Assembly Language Fundamentals: Elements of Assembly Language programming, Assembly scheme",
                    "Assembler Design: Pass structure of assembler",
                    "Assembler Design: Two pass assembler Design",
                    "Assembler Design: Single pass Assembler Design for X86 processor",
                    "Data Structures: Study the data structures used in assembler design"
                ]
            },
            {
                id: "csc601-m3",
                title: "Module 3: Macros and Macro Processor",
                hours: 6,
                topics: [
                    "Basics: Macro definition and call",
                    "Features: Simple, parameterized, conditional, and nested macros",
                    "Design: Design of Two pass macro processor",
                    "Design: Data structures used"
                ]
            },
            {
                id: "csc601-m4",
                title: "Module 4: Loaders and Linkers",
                hours: 6,
                topics: [
                    "Concepts: Functions of loaders, Relocation, and Linking",
                    "Loading Schemes: Relocating loader",
                    "Loading Schemes: Direct Linking Loader",
                    "Loading Schemes: Dynamic linking and loading"
                ]
            },
            {
                id: "csc601-m5",
                title: "Module 5: Compilers: Analysis Phase",
                hours: 10,
                topics: [
                    "Introduction: Phases of compilers",
                    "Lexical Analysis: Role of Finite State Automata",
                    "Lexical Analysis: Design of Lexical analyzer & data structures",
                    "Syntax Analysis: Role of Context Free Grammar",
                    "Syntax Analysis: Top down parsers: LL(1)",
                    "Syntax Analysis: Bottom up parsers: SR Parser, Operator precedence parser, SLR",
                    "Semantic Analysis: Syntax directed definitions"
                ]
            },
            {
                id: "csc601-m6",
                title: "Module 6: Compilers: Synthesis Phase",
                hours: 8,
                topics: [
                    "Intermediate Code Generation: Types: Syntax tree, Postfix notation",
                    "Intermediate Code Generation: Three address codes: Triples, Quadruples, Indirect triple",
                    "Code Optimization: Need and sources of optimization",
                    "Code Optimization: Techniques: Machine Dependent and Machine Independent",
                    "Code Generation: Issues in design",
                    "Code Generation: Code generation algorithm",
                    "Code Generation: Basic block and flow graph"
                ]
            }
        ]
    },
    {
        code: "CSC602",
        name: "Cryptography & System Security",
        description: "Securing information and systems using mathematical techniques and protocols.",
        modules: [
            {
                id: "csc602-m1",
                title: "Module 1: Introduction - Number Theory and Basic Cryptography",
                hours: 8,
                topics: [
                    "Security Basics: Goals, Attacks, Services, Mechanisms, Techniques",
                    "Modular Arithmetic: Euclidean Algorithm, Fermat’s and Euler’s theorem",
                    "Classical Encryption Techniques: Symmetric cipher model",
                    "Classical Encryption Techniques: Substitution: Vigenere, Playfair, Hill cipher",
                    "Classical Encryption Techniques: Transposition: Keyed and Keyless"
                ]
            },
            {
                id: "csc602-m2",
                title: "Module 2: Symmetric and Asymmetric Key Cryptography",
                hours: 11,
                topics: [
                    "Symmetric Key: Block cipher principles & modes of operation",
                    "Symmetric Key: Algorithms: DES, Double DES, Triple DES, AES",
                    "Symmetric Key: Stream Ciphers: RC4 algorithm",
                    "Public Key Cryptography: Principles of public key cryptosystems",
                    "Public Key Cryptography: RSA Cryptosystem",
                    "Public Key Cryptography: The Knapsack cryptosystem",
                    "Key Management & Distribution: Symmetric: KDC, Needham-Schroeder protocol, Kerberos, Diffie Hellman",
                    "Key Management & Distribution: Public Key: Digital Certificate (X.509), PKI"
                ]
            },
            {
                id: "csc602-m3",
                title: "Module 3: Cryptographic Hash Functions",
                hours: 3,
                topics: [
                    "Hash Functions: Properties of secure hash functions",
                    "Algorithms: MD5, SHA-1",
                    "Message Authentication: MAC, HMAC, CMAC"
                ]
            },
            {
                id: "csc602-m4",
                title: "Module 4: Authentication Protocols & Digital Signature Schemes",
                hours: 5,
                topics: [
                    "Authentication: User Authentication",
                    "Authentication: Entity Authentication: Password Based, Challenge Response Based",
                    "Digital Signatures: Digital Signature, Attacks on Digital Signature",
                    "Digital Signatures: Digital Signature Scheme: RSA"
                ]
            },
            {
                id: "csc602-m5",
                title: "Module 5: Network Security and Applications",
                hours: 9,
                topics: [
                    "Network Security Basics: TCP/IP vulnerabilities (Layer wise)",
                    "Network Security Basics: Network Attacks: Packet Sniffing, ARP spoofing, port scanning, IP spoofing",
                    "Denial of Service: DOS attacks, ICMP flood, SYN flood, UDP flood",
                    "Denial of Service: Distributed Denial of Service (DDoS)",
                    "Internet Security Protocols: PGP, SSL, IPSEC",
                    "Network Security Tools: IDS, Firewalls"
                ]
            },
            {
                id: "csc602-m6",
                title: "Module 6: System Security",
                hours: 3,
                topics: [
                    "Vulnerabilities: Buffer Overflow, SQL injection",
                    "Malicious Programs: Worms and Viruses"
                ]
            }
        ]
    },
    {
        code: "CSC603",
        name: "Mobile Computing",
        description: "Mobile communication systems, networking, and protocols.",
        modules: [
            {
                id: "csc603-m1",
                title: "Module 1: Introduction to Mobile Computing",
                hours: 4,
                topics: [
                    "Basics: Introduction, Telecommunication Generations, Cellular systems",
                    "Signal & Transmission: Electromagnetic Spectrum, Antenna, Signal Propagation, Signal Characteristics",
                    "Signal & Transmission: Multiplexing",
                    "Signal & Transmission: Spread Spectrum: DSSS & FHSS",
                    "Signal & Transmission: Co-channel interference"
                ]
            },
            {
                id: "csc603-m2",
                title: "Module 2: GSM Mobile Services",
                hours: 8,
                topics: [
                    "GSM: Mobile services, System Architecture, Radio interface, Protocols",
                    "GSM: Localization and Calling, Handover",
                    "GSM: Security (A3, A5 & A8)",
                    "GPRS: System and protocol architecture",
                    "UMTS: UTRAN, UMTS core network, Improvements on Core Network"
                ]
            },
            {
                id: "csc603-m3",
                title: "Module 3: Mobile Networking",
                hours: 8,
                topics: [
                    "Protocols: Medium Access Protocol, Internet Protocol and Transport layer",
                    "Mobile IP: IP Packet Delivery, Agent Advertisement and Discovery",
                    "Mobile IP: Registration, Tunneling and Encapsulation, Reverse Tunneling",
                    "Mobile TCP: Traditional TCP",
                    "Mobile TCP: Classical TCP Improvements: Indirect TCP, Snooping TCP, Mobile TCP",
                    "Mobile TCP: Fast Retransmit/Fast Recovery, Transmission/Timeout Freezing, Selective Retransmission"
                ]
            },
            {
                id: "csc603-m4",
                title: "Module 4: Wireless Local Area Networks",
                hours: 6,
                topics: [
                    "WLAN Overview: Introduction, Infrastructure and ad-hoc network",
                    "IEEE 802.11: System & Protocol architecture",
                    "IEEE 802.11: Physical layer, Medium access control layer, MAC management",
                    "IEEE 802.11: 802.11a, 802.11b standard",
                    "Wi-Fi Security: WEP, WPA, Wireless LAN Threats, Securing Wireless Networks",
                    "Bluetooth: Introduction, User Scenario, Architecture, protocol stack"
                ]
            },
            {
                id: "csc603-m5",
                title: "Module 5: Mobility Management",
                hours: 6,
                topics: [
                    "Basics: Introduction, IP Mobility, Optimization, IPv6",
                    "Macro Mobility: MIPv6, FMIPv6",
                    "Micro Mobility: CellularIP, HAWAII, HMIPv6"
                ]
            },
            {
                id: "csc603-m6",
                title: "Module 6: Long-Term Evolution (LTE) of 3GPP",
                hours: 7,
                topics: [
                    "LTE Overview: LTE System Overview, Evolution from UMTS to LTE",
                    "Architecture: LTE/SAE Requirements, SAE Architecture",
                    "EPS: Evolved Packet System, E-UTRAN, Voice over LTE (VoLTE), Introduction to LTE-Advanced",
                    "Future Trends: Self Organizing Network (SON-LTE), SON for Heterogeneous Networks (HetNet)",
                    "Future Trends: Comparison between Different Generations (2G, 3G, 4G and 5G)",
                    "Future Trends: Introduction to 5G"
                ]
            }
        ]
    },
    {
        code: "CSC604",
        name: "Artificial Intelligence",
        description: "Intelligent agents, search algorithms, knowledge reasoning, and AI applications.",
        modules: [
            {
                id: "csc604-m1",
                title: "Module 1: Introduction to Artificial Intelligence",
                hours: 4,
                topics: [
                    "Overview: History, Intelligent Systems, Categorization, Components of AI Program",
                    "Foundations: Sub-areas of AI, Applications, Current trends"
                ]
            },
            {
                id: "csc604-m2",
                title: "Module 2: Intelligent Agents",
                hours: 4,
                topics: [
                    "Agents: Agents and Environments, Concept of rationality, Nature of environment",
                    "Structure: Structure of Agents, Types of Agents, Learning Agent",
                    "Problem Solving: Solving problem by Searching, Problem Solving Agent, Formulating Problems, Example Problems"
                ]
            },
            {
                id: "csc604-m3",
                title: "Module 3: Problem Solving",
                hours: 10,
                topics: [
                    "Uninformed Search: BFS, DFS, Depth Limited Search, DFID",
                    "Informed Search: Greedy best first Search, A* Search, Memory bounded heuristic Search",
                    "Local Search & Optimization: Hill climbing, Simulated annealing, Genetic algorithms",
                    "Adversarial Search: Game Playing, Min-Max Search, Alpha Beta Pruning"
                ]
            },
            {
                id: "csc604-m4",
                title: "Module 4: Knowledge and Reasoning",
                hours: 12,
                topics: [
                    "Logic: Knowledge based Agents, Propositional logic",
                    "Logic: First Order Logic (FOL): Syntax and Semantic, Inference in FOL",
                    "Logic: Forward chaining, Backward Chaining",
                    "Knowledge Engineering: In First-Order Logic, Unification, Resolution",
                    "Uncertain Knowledge: Uncertainty, Representing knowledge in an uncertain domain",
                    "Uncertain Knowledge: Belief network: Semantics, Simple Inference"
                ]
            },
            {
                id: "csc604-m5",
                title: "Module 5: Planning and Learning",
                hours: 5,
                topics: [
                    "Planning: The planning problem, Planning with state space search",
                    "Planning: Partial order planning, Hierarchical planning, Conditional Planning",
                    "Learning: Forms of Learning, Theory of Learning, PAC learning",
                    "Learning: Introduction to statistical learning",
                    "Learning: Reinforcement learning: Learning from Rewards, Passive/Active RL"
                ]
            },
            {
                id: "csc604-m6",
                title: "Module 6: AI Applications",
                hours: 4,
                topics: [
                    "NLP: Introduction, Language models, Grammars, Parsing",
                    "Robotics: Robots, Robot hardware, Problems Robotics can solve",
                    "Industry Applications: Healthcare, Retail, Banking"
                ]
            }
        ]
    },
    {
        code: "CSDLO6011",
        name: "Internet of Things",
        description: "IoT architecture, sensors, protocols, and domain-specific applications.",
        modules: [
            {
                id: "csdlo6011-m1",
                title: "Module 1: Introduction to Internet of Things (IoT)",
                hours: 7,
                topics: [
                    "Basics: What is IoT? - IoT and Digitization",
                    "Impact: Connected Roadways, Factory, Buildings, Creatures",
                    "Challenges: Convergence of IT and OT, IoT Challenges",
                    "Architecture: The oneM2M IoT Standardized Architecture",
                    "Architecture: The IoT World Forum (IoTWF) Standardized Architecture",
                    "Stack: IoT Data Management and Compute Stack (Fog, Edge, Cloud Hierarchy)"
                ]
            },
            {
                id: "csdlo6011-m2",
                title: "Module 2: Things in IoT",
                hours: 7,
                topics: [
                    "Sensors/Transducers: Definition, Principles, Classifications, Types, Characteristics",
                    "Actuators: Definition, Principles, Classifications, Types, Characteristics",
                    "Smart Object: Definition, Characteristics and Trends",
                    "Sensor Networks: Architecture of Wireless Sensor Network, Network Topologies",
                    "Enabling Technologies: RFID, MEMS, NFC, BLE, LTE-A, IEEE 802.15.4, ZigBee"
                ]
            },
            {
                id: "csdlo6011-m3",
                title: "Module 3: The Core IoT Functional Stack",
                hours: 6,
                topics: [
                    "Layer 1 (Things): Sensors and Actuators Layer",
                    "Layer 2 (Communications): Access Network, Gateways, Network Transport, IoT Network Management",
                    "Layer 3 (Applications): Applications and Analytics Layer, Analytics vs Control, Data vs Network Analytics"
                ]
            },
            {
                id: "csdlo6011-m4",
                title: "Module 4: Application Protocols for IoT",
                hours: 7,
                topics: [
                    "Transport Layer: IoT Application Transport Methods",
                    "SCADA: Background, Adapting for IP, Tunneling, Translation",
                    "Protocols: Generic Web-Based Protocols",
                    "Protocols: IoT Application Layer Protocols: CoAP and MQTT"
                ]
            },
            {
                id: "csdlo6011-m5",
                title: "Module 5: Domain Specific IoTs",
                hours: 6,
                topics: [
                    "Home Automation: Smart Lighting, Appliances, Intrusion, Smoke/Gas",
                    "Cities: Smart Parking, Lighting, Roads, Structural Health, Surveillance",
                    "Environment: Weather, Air Pollution, Noise, Forest Fire, River Floods",
                    "Energy: Smart Grids, Renewable Energy, Prognostics",
                    "Retail: Inventory, Smart Payments, Vending Machines",
                    "Logistics: Route Generation, Fleet Tracking, Shipment Monitoring",
                    "Agriculture: Smart Irrigation, Green House Control",
                    "Industry: Machine Diagnostics, Indoor Air Quality",
                    "Health: Health & Fitness Monitoring, Wearable Electronics"
                ]
            },
            {
                id: "csdlo6011-m6",
                title: "Module 6: Create your own IoT",
                hours: 6,
                topics: [
                    "Hardware: Arduino, Raspberry Pi, ESP32, Cloudbit, Particle Photon, Beaglebone Black",
                    "Software: Languages, Middleware, API development, REST, JSON-LD",
                    "Comparisons: IoT boards and platforms (Computing, Environments, Connectivity)",
                    "Comparisons: IoT software platforms"
                ]
            }
        ]
    }
];
