// SY0-701 Practice Exam — 90 questions
// Sourced from: SY0-701_Practice_Exam_2026-04-26.md
// Domain weighting matches official CompTIA SY0-701 blueprint:
//   Domain 1: 11 questions (12%)
//   Domain 2: 20 questions (22%)
//   Domain 3: 16 questions (18%)
//   Domain 4: 25 questions (28%)
//   Domain 5: 18 questions (20%)
// Each question: { num, domain, domainNum, acronym, scenario, selectMulti,
//                  stem, options, correct, explanation, wrongHint }

window.QUIZ_DATA = [
  { num: 1, domain: "Domain 1.2 — CIA & Least Privilege", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY purpose of implementing the principle of least privilege?",
    options: { A: "Reduce hardware procurement costs", B: "Limit the blast radius from compromised accounts", C: "Improve database query performance", D: "Simplify password reset workflows" },
    correct: "B",
    explanation: "Least privilege ensures users hold only the rights necessary for their role, so a compromised account causes minimal lateral damage.",
    wrongHint: { letter: "A", text: "A is a financial concern unrelated to access control; least privilege does not lower hardware costs." } },

  { num: 2, domain: "Domain 1.4 — Zero Trust", domainNum: 1, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A security architect designs a system where every access request — internal or external — must be authenticated, authorized, and continuously verified before being granted, with no implicit trust based on network location. Which model is being implemented?",
    options: { A: "Defense in depth", B: "Zero Trust", C: "Castle-and-moat perimeter", D: "Air-gapped isolation" },
    correct: "B",
    explanation: "Zero Trust assumes no implicit trust and demands continuous verification regardless of source.",
    wrongHint: { letter: "A", text: "Defense in depth stacks layered controls but still permits implicit internal trust." } },

  { num: 3, domain: "Domain 1.4 — ZTNA", domainNum: 1, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] What does ZTNA stand for?",
    options: { A: "Zero Trust Network Access", B: "Zonal Trust Network Authority", C: "Zero Time Network Authentication", D: "Zoned Tunnel Negotiation Algorithm" },
    correct: "A",
    explanation: "ZTNA (Zero Trust Network Access) provides identity- and context-aware access to specific resources rather than the whole network.",
    wrongHint: { letter: "B", text: "B sounds plausible but is not a real CompTIA term." } },

  { num: 4, domain: "Domain 1.1 — Control Categories", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "Security awareness training, acceptable-use policies, and risk management procedures are BEST classified as which control category?",
    options: { A: "Technical controls", B: "Managerial controls", C: "Operational controls", D: "Physical controls" },
    correct: "B",
    explanation: "Managerial (administrative) controls are policy- and procedure-based mechanisms that direct security behavior.",
    wrongHint: { letter: "C", text: "Operational describes day-to-day execution by people, but policy and risk management documents are managerial." } },

  { num: 5, domain: "Domain 1.1 — Control Functions", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "A bollard installed in front of a building's lobby is BEST classified as which control function?",
    options: { A: "Detective", B: "Compensating", C: "Preventive", D: "Corrective" },
    correct: "C",
    explanation: "Bollards physically prevent vehicles from reaching the entrance, stopping the event before it occurs.",
    wrongHint: { letter: "A", text: "Detective controls only identify events (e.g., cameras); bollards block them." } },

  { num: 6, domain: "Domain 1.2 — CIA Triad", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "Which property of the CIA triad is violated when an attacker silently modifies database records without authorization?",
    options: { A: "Confidentiality", B: "Integrity", C: "Availability", D: "Accountability" },
    correct: "B",
    explanation: "Unauthorized modification compromises integrity, the assurance that data has not been altered improperly.",
    wrongHint: { letter: "A", text: "Confidentiality deals with disclosure, not alteration." } },

  { num: 7, domain: "Domain 1.3 — Change Management", domainNum: 1, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Before any firewall rule change is implemented, a Change Advisory Board reviews the proposal, risk, and rollback plan. Which change-management element does the CAB review primarily represent?",
    options: { A: "Backout plan", B: "Approval process", C: "Maintenance window scheduling", D: "Configuration validation" },
    correct: "B",
    explanation: "The CAB formally approves or rejects proposed changes based on risk and impact.",
    wrongHint: { letter: "A", text: "Backout plan is a component of the package the CAB reviews, not the CAB function itself." } },

  { num: 8, domain: "Domain 1.4 — Non-Repudiation", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "When a digital signature on a contract prevents the signer from later denying they signed it, which security property is achieved?",
    options: { A: "Confidentiality", B: "Authentication", C: "Non-repudiation", D: "Authorization" },
    correct: "C",
    explanation: "Non-repudiation provides cryptographic proof that a specific party originated a message or signature.",
    wrongHint: { letter: "B", text: "Authentication only proves identity at the moment of access; it does not bind a signer to past actions." } },

  { num: 9, domain: "Domain 1.4 — PKI / CRL", domainNum: 1, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In a PKI, which mechanism publishes a list of certificates that have been revoked before expiration?",
    options: { A: "RA (Registration Authority)", B: "CA root store", C: "CRL (Certificate Revocation List)", D: "HSM repository" },
    correct: "C",
    explanation: "A CRL is a signed list issued by the CA enumerating revoked certificate serial numbers.",
    wrongHint: { letter: "A", text: "The RA validates identity for issuance; it does not publish revocations." } },

  { num: 10, domain: "Domain 1.4 — OCSP", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "An organization wants to verify a single certificate's revocation status in real time without downloading large list files. Which protocol BEST meets this need?",
    options: { A: "CRL distribution", B: "OCSP", C: "SCEP", D: "LDAP referral" },
    correct: "B",
    explanation: "OCSP (Online Certificate Status Protocol) returns per-certificate revocation status on demand.",
    wrongHint: { letter: "A", text: "CRLs require downloading the full list, which is exactly what they want to avoid." } },

  { num: 11, domain: "Domain 1.4 — HSM", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY advantage of storing private keys in a hardware security module instead of in software keystores?",
    options: { A: "Faster bulk encryption performance", B: "Lower licensing cost than software solutions", C: "Tamper-resistant key generation and storage", D: "Easier offsite backup" },
    correct: "C",
    explanation: "HSMs provide FIPS-validated, tamper-resistant boundaries that prevent key extraction.",
    wrongHint: { letter: "A", text: "Performance is not the main reason; tamper resistance and key isolation are." } },

  { num: 12, domain: "Domain 2.2 — Ransomware", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which malware type encrypts a victim's files and demands payment in exchange for the decryption key?",
    options: { A: "Worm", B: "Ransomware", C: "Spyware", D: "Adware" },
    correct: "B",
    explanation: "Ransomware's defining behavior is file encryption with extortion for restoration.",
    wrongHint: { letter: "C", text: "Spyware exfiltrates information but typically does not encrypt files." } },

  { num: 13, domain: "Domain 2.4 — Rootkit", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A SOC analyst sees that several malicious processes on a server are hidden from Task Manager and standard listing tools, yet appear when scanned at the kernel level using a forensic utility. Which malware family fits BEST?",
    options: { A: "Banking trojan", B: "Worm", C: "Rootkit", D: "Adware" },
    correct: "C",
    explanation: "Rootkits operate at kernel level and hide their presence from user-space tools.",
    wrongHint: { letter: "A", text: "Trojans masquerade as legitimate apps but do not typically hide kernel-level objects." } },

  { num: 14, domain: "Domain 2.2 — Typosquatting", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "An attacker registers \"paypa1.com\" hoping users mistype the legitimate banking site. Which technique is this?",
    options: { A: "Pharming", B: "Typosquatting", C: "Watering-hole attack", D: "DNS hijacking" },
    correct: "B",
    explanation: "Typosquatting registers domains that exploit common typing errors to lure victims.",
    wrongHint: { letter: "A", text: "Pharming redirects DNS resolution; typosquatting depends on the user typing the wrong URL themselves." } },

  { num: 15, domain: "Domain 2.1 — APT", domainNum: 2, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] An \"APT\" most accurately describes which kind of adversary?",
    options: { A: "An automatic patch tool used by IT", B: "An advanced persistent threat actor with sustained, stealthy access", C: "An asymmetric password technique used in PKI", D: "A protocol for asynchronous packet transfer" },
    correct: "B",
    explanation: "APTs are well-resourced (often nation-state) actors who maintain long-term covert access.",
    wrongHint: { letter: "D", text: "D is a fabricated networking term included as a plausible distractor." } },

  { num: 16, domain: "Domain 2.1 — Threat Actor Motivation", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which threat actor is MOST LIKELY motivated by direct financial gain rather than ideology or geopolitics?",
    options: { A: "Hacktivist", B: "Nation-state", C: "Organized cybercrime group", D: "Insider whistleblower" },
    correct: "C",
    explanation: "Organized crime monetizes intrusions through ransomware, fraud, and data sale.",
    wrongHint: { letter: "B", text: "Nation-states sometimes pursue financial goals, but their primary motivation is strategic/political." } },

  { num: 17, domain: "Domain 2.4 — SQL Injection", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "A web application concatenates user-supplied input directly into a database query without sanitization. Which attack is MOST LIKELY to succeed?",
    options: { A: "Cross-site scripting", B: "SQL injection", C: "Buffer overflow", D: "CSRF" },
    correct: "B",
    explanation: "Unsanitized input concatenated into SQL is the textbook recipe for SQL injection.",
    wrongHint: { letter: "A", text: "XSS targets the browser via reflected/stored JavaScript, not the database query." } },

  { num: 18, domain: "Domain 2.4 — Stored XSS", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) During a pen test, the tester saves a malicious script in a forum post. Each subsequent visitor's browser executes the script automatically. Which attack class is this?",
    options: { A: "Stored (persistent) XSS", B: "Reflected XSS", C: "DOM-based XSS", D: "SQL injection" },
    correct: "A",
    explanation: "Stored XSS persists on the server and is delivered to every viewing user.",
    wrongHint: { letter: "B", text: "Reflected XSS requires victims to click a crafted link; the attack here is automatic on every view." } },

  { num: 19, domain: "Domain 2.4 — Evil Twin", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "An attacker stands up a rogue Wi-Fi access point with the same SSID as a legitimate one to lure users and intercept traffic. What is this attack called?",
    options: { A: "Bluejacking", B: "Evil twin", C: "Disassociation flood", D: "Replay attack" },
    correct: "B",
    explanation: "An evil twin impersonates a trusted SSID to perform on-path interception.",
    wrongHint: { letter: "C", text: "Disassociation forces clients off; an evil twin lures them onto the rogue AP." } },

  { num: 20, domain: "Domain 2.2 — Vishing", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which social-engineering technique uses voice phone calls — often spoofing a help desk or executive — to manipulate the victim?",
    options: { A: "Smishing", B: "Vishing", C: "Whaling", D: "Pretexting (general)" },
    correct: "B",
    explanation: "Vishing is voice phishing conducted over telephone or VoIP.",
    wrongHint: { letter: "D", text: "Pretexting is the broader manipulation tactic; vishing is the specific channel here." } },

  { num: 21, domain: "Domain 2.5 — DEP/NX", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which mitigation prevents code from running in regions of memory marked as data only?",
    options: { A: "ASLR", B: "DEP / NX", C: "Stack canaries", D: "Input length checks" },
    correct: "B",
    explanation: "Data Execution Prevention (DEP/NX) marks memory pages non-executable, blocking many shellcode techniques.",
    wrongHint: { letter: "A", text: "ASLR randomizes memory layout but does not enforce non-executability of pages." } },

  { num: 22, domain: "Domain 2.3 — CVSS", domainNum: 2, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] A vulnerability is published with a CVSS base score of 9.8. What does CVSS represent?",
    options: { A: "Common Vulnerability Scoring System", B: "Critical Vendor Security Standard", C: "Centralized Vulnerability Surveillance Service", D: "Configuration and Vulnerability Software Suite" },
    correct: "A",
    explanation: "CVSS is the industry-standard framework for rating vulnerability severity.",
    wrongHint: { letter: "B", text: "B sounds bureaucratic and plausible but is not a real industry standard." } },

  { num: 23, domain: "Domain 2.3 — Supply Chain", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which scenario BEST describes a supply-chain attack?",
    options: { A: "Disrupting truck shipments to a data center", B: "Compromising a trusted vendor's update mechanism to reach all of its downstream customers", C: "Stealing physical hardware from a warehouse", D: "Spoofing a courier delivery email" },
    correct: "B",
    explanation: "Supply-chain attacks ride trusted vendor channels (e.g., software updates) to reach many victims.",
    wrongHint: { letter: "D", text: "That's a phishing lure, not a supply-chain compromise." } },

  { num: 24, domain: "Domain 2.3 — Zero-Day", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "A previously unknown vulnerability with no available patch and no public signature is BEST classified as:",
    options: { A: "Legacy vulnerability", B: "Misconfiguration", C: "Zero-day", D: "End-of-life flaw" },
    correct: "C",
    explanation: "A zero-day is unknown to defenders/vendors at the time of exploitation.",
    wrongHint: { letter: "A", text: "Legacy vulnerabilities are known but unpatched on outdated systems." } },

  { num: 25, domain: "Domain 2.4 — Auth Attack Patterns", domainNum: 2, acronym: false, scenario: true, selectMulti: true,
    stem: "[SELECT TWO] (Scenario) A security analyst reviews authentication logs and sees thousands of failed logons from one IP across many usernames, then a single successful logon. Which attack types are MOST consistent with this pattern?",
    options: { A: "Password spraying", B: "Brute force / credential stuffing", C: "Pass-the-hash", D: "Privilege escalation", E: "Distributed denial of service" },
    correct: ["A", "B"],
    explanation: "Password spraying tries common passwords across many accounts; brute force/credential stuffing tries many guesses, both producing high failure-to-success ratios.",
    wrongHint: { letter: "C", text: "Pass-the-hash reuses captured NTLM hashes and would not typically generate thousands of failed password attempts." } },

  { num: 26, domain: "Domain 2.5 — Segmentation", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY security benefit of network segmentation?",
    options: { A: "Higher available bandwidth", B: "Limiting an attacker's ability to move laterally between systems", C: "Reducing password reuse", D: "Eliminating phishing" },
    correct: "B",
    explanation: "Segmentation contains compromise by restricting east-west traffic between zones.",
    wrongHint: { letter: "A", text: "Bandwidth gains may occur but are not the security objective." } },

  { num: 27, domain: "Domain 2.2 — BEC / Spear Phishing", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "A finance employee receives an email that appears to be from the CEO urgently requesting a wire transfer to a new vendor. This is BEST classified as:",
    options: { A: "Mass phishing", B: "Whaling", C: "Spear phishing / Business Email Compromise", D: "Smishing" },
    correct: "C",
    explanation: "Targeting a specific employee with a tailored, executive-impersonation request is spear phishing/BEC.",
    wrongHint: { letter: "B", text: "Whaling specifically targets the executive themselves; here the executive is being impersonated." } },

  { num: 28, domain: "Domain 2.3 — IOC", domainNum: 2, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] Which definition BEST matches the term IOC?",
    options: { A: "Internal Operating Codes", B: "Indicators of Compromise", C: "Inbound Origin Controls", D: "Identity Object Categories" },
    correct: "B",
    explanation: "IOCs are observable artifacts (file hashes, IPs, registry keys) that suggest a compromise has occurred.",
    wrongHint: { letter: "D", text: "D is a fabricated phrase designed to look plausible." } },

  { num: 29, domain: "Domain 2.4 — ARP Poisoning", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A workstation begins broadcasting forged ARP replies that map the gateway's IP address to its own MAC address. Which attack is occurring?",
    options: { A: "DNS poisoning", B: "MAC flooding", C: "ARP poisoning (spoofing)", D: "VLAN hopping" },
    correct: "C",
    explanation: "Sending forged ARP replies to redirect traffic is ARP poisoning, enabling on-path interception.",
    wrongHint: { letter: "B", text: "MAC flooding overwhelms switch CAM tables; it does not target ARP mappings." } },

  { num: 30, domain: "Domain 2.5 — Hardening", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which hardening practice removes unused services, default accounts, and unnecessary features to shrink the attack surface?",
    options: { A: "Patch management", B: "System hardening / minimization", C: "Tokenization", D: "Sandboxing" },
    correct: "B",
    explanation: "Hardening explicitly minimizes exposure by trimming non-essential capabilities.",
    wrongHint: { letter: "A", text: "Patch management addresses known flaws but does not remove unused services." } },

  { num: 31, domain: "Domain 2.4 — VM Escape", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "An attacker exploits a hypervisor flaw allowing code in one guest VM to gain access to other VMs or the host. This is known as:",
    options: { A: "Container escape", B: "VM escape", C: "Privilege creep", D: "Sandbox bypass" },
    correct: "B",
    explanation: "VM escape breaks the isolation boundary the hypervisor is meant to enforce.",
    wrongHint: { letter: "A", text: "Container escape is the analogous attack against container runtimes, not hypervisors." } },

  { num: 32, domain: "Domain 3.1 — Cloud Shared Responsibility", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "In which cloud service model does the customer carry the MOST security responsibility for OS patching, runtime, and application code?",
    options: { A: "SaaS", B: "PaaS", C: "IaaS", D: "FaaS" },
    correct: "C",
    explanation: "In IaaS the provider secures the hypervisor and below; the customer secures the OS and up.",
    wrongHint: { letter: "A", text: "SaaS leaves almost everything to the provider." } },

  { num: 33, domain: "Domain 3.1 — BYOK", domainNum: 3, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A company storing regulated data in a public cloud bucket wants encryption with keys it controls and can revoke. Which feature should be configured?",
    options: { A: "BYOK (Bring Your Own Key)", B: "DRM watermarking", C: "HSTS", D: "IAM resource tagging" },
    correct: "A",
    explanation: "BYOK lets the customer supply and manage the encryption keys used by the cloud provider.",
    wrongHint: { letter: "C", text: "HSTS forces HTTPS in browsers; it has nothing to do with object encryption keys." } },

  { num: 34, domain: "Domain 3.2 — WAF", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which firewall variant inspects HTTP/S payloads to block injection and OWASP-style application-layer attacks?",
    options: { A: "Stateless packet filter", B: "Stateful firewall", C: "Web Application Firewall (WAF)", D: "Proxy ARP gateway" },
    correct: "C",
    explanation: "WAFs operate at L7 to inspect and filter web request content.",
    wrongHint: { letter: "B", text: "Stateful firewalls track sessions but do not deeply parse application payloads." } },

  { num: 35, domain: "Domain 3.2 — NGFW", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] An NGFW differs from a traditional stateful firewall PRIMARILY because it adds:",
    options: { A: "A network gateway and routing table", B: "Deep packet inspection, application awareness, and integrated IPS", C: "NAT and DHCP serving", D: "Local DNS resolution caching" },
    correct: "B",
    explanation: "Next-Generation Firewalls combine stateful inspection with DPI, application identification, and IPS.",
    wrongHint: { letter: "A", text: "Routing is found in any firewall and is not the differentiator." } },

  { num: 36, domain: "Domain 3.3 — Tokenization", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "An organization wants to store credit-card numbers such that the actual values are replaced by non-sensitive references that map back only via a secure vault. Which technique is BEST?",
    options: { A: "Transparent data encryption", B: "Tokenization", C: "Hashing", D: "Static masking only" },
    correct: "B",
    explanation: "Tokenization substitutes a meaningless reference for sensitive data, with the mapping kept in a hardened vault.",
    wrongHint: { letter: "A", text: "TDE protects data at rest but the actual PAN is still present and decryptable." } },

  { num: 37, domain: "Domain 3.3 — Site-to-Site VPN", domainNum: 3, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Two hospitals must share medical imaging files securely between sites over the public Internet. Which solution BEST balances confidentiality and routine connectivity?",
    options: { A: "Plaintext HTTP to a public web server", B: "Site-to-site IPSec VPN", C: "Telnet", D: "SNMPv2 community strings" },
    correct: "B",
    explanation: "Site-to-site IPSec creates an authenticated, encrypted tunnel between the two networks.",
    wrongHint: { letter: "A", text: "HTTP provides no confidentiality and is unsuitable for PHI." } },

  { num: 38, domain: "Domain 3.4 — RAID 5", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which RAID level provides striping with distributed parity, tolerating one drive failure?",
    options: { A: "RAID 0", B: "RAID 1", C: "RAID 5", D: "RAID 10" },
    correct: "C",
    explanation: "RAID 5 stripes data and parity across drives, surviving a single failure.",
    wrongHint: { letter: "A", text: "RAID 0 stripes only — any single drive failure is total data loss." } },

  { num: 39, domain: "Domain 3.4 — Geographic Redundancy", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "What concept is achieved by deploying redundant components in multiple geographic regions so a regional outage does not stop the service?",
    options: { A: "Vertical scaling", B: "Geographic redundancy / high availability", C: "Containerization", D: "Just-in-time provisioning" },
    correct: "B",
    explanation: "Spreading workloads across regions provides resilience against regional disasters.",
    wrongHint: { letter: "A", text: "Vertical scaling adds CPU/RAM to one node and offers no geographic resilience." } },

  { num: 40, domain: "Domain 3.1 — SDN", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In an SDN architecture, the control plane is decoupled from the:",
    options: { A: "Authentication layer", B: "Storage area network", C: "Data (forwarding) plane", D: "Application layer" },
    correct: "C",
    explanation: "Software-Defined Networking separates the centralized control plane from the per-device forwarding plane.",
    wrongHint: { letter: "D", text: "The application layer talks to controllers via northbound APIs; it is not what the control plane is decoupled from." } },

  { num: 41, domain: "Domain 3.2 — IPS vs IDS", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which device sits inline on the network and can actively block detected malicious traffic in real time?",
    options: { A: "IDS", B: "IPS", C: "Honeypot", D: "SPAN port" },
    correct: "B",
    explanation: "An IPS is inline and actively drops or resets malicious flows, whereas an IDS only alerts.",
    wrongHint: { letter: "A", text: "IDS observes copies of traffic and cannot stop the original." } },

  { num: 42, domain: "Domain 3.3 — Password Hashing", domainNum: 3, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A developer wants password storage that resists rainbow-table cracking even if the database is stolen. Which approach is BEST?",
    options: { A: "AES-128 encryption with a static key", B: "Salting and a slow adaptive hash such as bcrypt or Argon2", C: "Base64 encoding of the password", D: "MD5 with no salt" },
    correct: "B",
    explanation: "Per-user salts plus a slow KDF defeat precomputed tables and slow brute-force attempts.",
    wrongHint: { letter: "A", text: "Encryption is reversible; passwords should be hashed, not encrypted." } },

  { num: 43, domain: "Domain 3.2 — Microsegmentation", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which architectural concept isolates each workload such that compromise of one does not enable lateral access to neighbors?",
    options: { A: "Microsegmentation", B: "Flat routing", C: "Trunk port tagging", D: "Dynamic routing protocols" },
    correct: "A",
    explanation: "Microsegmentation enforces fine-grained policy between individual workloads, often via SDN.",
    wrongHint: { letter: "B", text: "Flat networks are the opposite — no internal isolation at all." } },

  { num: 44, domain: "Domain 3.4 — Backup Types", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which backup type captures only data changed since the LAST FULL backup (and grows in size each day until the next full)?",
    options: { A: "Differential", B: "Incremental", C: "Snapshot", D: "Synthetic full" },
    correct: "A",
    explanation: "Differential backups grow each day relative to the last full backup until the next full is taken.",
    wrongHint: { letter: "B", text: "Incremental captures changes since the last backup of any type, not since the last full." } },

  { num: 45, domain: "Domain 3.4 — RPO", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] Which acronym defines the maximum acceptable amount of data loss measured in TIME (e.g., \"we can lose at most 15 minutes of data\")?",
    options: { A: "RTO", B: "MTD", C: "RPO", D: "MTBF" },
    correct: "C",
    explanation: "RPO (Recovery Point Objective) is the data-loss tolerance window.",
    wrongHint: { letter: "A", text: "RTO is recovery time, not data-loss volume." } },

  { num: 46, domain: "Domain 3.3 — Secure Boot / TPM", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "A security engineer needs assurance that the bootloader and kernel have not been tampered with prior to OS load. Which technology BEST supports this?",
    options: { A: "Antivirus boot scan", B: "Secure Boot anchored in the TPM", C: "BIOS supervisor password", D: "BitLocker without PIN" },
    correct: "B",
    explanation: "Secure Boot validates signed boot components against a TPM-anchored chain of trust.",
    wrongHint: { letter: "C", text: "BIOS passwords gate setup access but do not verify firmware/kernel integrity." } },

  { num: 47, domain: "Domain 3.1 — Cloud Deployment Models", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which cloud deployment model uses an externally hosted environment that is dedicated to and managed for a SINGLE organization?",
    options: { A: "Public cloud (multi-tenant)", B: "Community cloud", C: "Private cloud (hosted)", D: "Hybrid edge" },
    correct: "C",
    explanation: "Hosted private clouds are dedicated single-tenant environments, even when run by a third-party provider.",
    wrongHint: { letter: "B", text: "Community clouds are shared by several organizations with similar requirements." } },

  { num: 48, domain: "Domain 4.1 — Baselines", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which configuration management practice ensures systems remain in a documented, known-good state and that drift is detected?",
    options: { A: "Application allowlisting alone", B: "Security baselining with continuous monitoring", C: "Manual ad-hoc patching", D: "Disabling all logging to reduce noise" },
    correct: "B",
    explanation: "Baselines define the desired state and continuous monitoring detects deviation.",
    wrongHint: { letter: "D", text: "Disabling logs is actively harmful and is a distractor." } },

  { num: 49, domain: "Domain 4.2 — SIEM", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A SOC analyst correlates alerts from firewalls, EDR agents, DNS logs, and identity providers to spot lateral movement. Which platform is PRIMARILY used to centralize this correlation?",
    options: { A: "DLP gateway", B: "SIEM", C: "WAF", D: "HSM" },
    correct: "B",
    explanation: "SIEMs ingest and correlate logs from heterogeneous sources to surface composite attack patterns.",
    wrongHint: { letter: "A", text: "DLP focuses on data egress, not multi-source attack correlation." } },

  { num: 50, domain: "Domain 4.4 — IR Lifecycle", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which phase is the FIRST in the NIST SP 800-61 incident response lifecycle?",
    options: { A: "Detection and Analysis", B: "Preparation", C: "Containment, Eradication, and Recovery", D: "Post-Incident Activity" },
    correct: "B",
    explanation: "Preparation establishes policies, tools, training, and runbooks BEFORE an incident occurs.",
    wrongHint: { letter: "A", text: "Detection and Analysis is the second phase; you must be prepared to detect." } },

  { num: 51, domain: "Domain 4.2 — SOAR", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] A SOAR platform's PRIMARY value is to:",
    options: { A: "Replace SIEM databases entirely", B: "Orchestrate and automate incident-response workflows across tools", C: "Provide endpoint disk encryption", D: "Function as an antivirus signature feed" },
    correct: "B",
    explanation: "SOAR (Security Orchestration, Automation, and Response) executes playbooks across many tools to speed and standardize response.",
    wrongHint: { letter: "A", text: "SOAR augments rather than replaces SIEM." } },

  { num: 52, domain: "Domain 4.4 — Containment", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) During an active ransomware outbreak, the IR team disconnects the affected VLAN from the rest of the network to stop further spread. Which IR phase is this?",
    options: { A: "Eradication", B: "Recovery", C: "Containment", D: "Lessons Learned" },
    correct: "C",
    explanation: "Containment limits damage and prevents spread while the team prepares to eradicate.",
    wrongHint: { letter: "A", text: "Eradication removes the threat artifacts; that step comes after containment." } },

  { num: 53, domain: "Domain 4.3 — Credentialed Scans", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which type of vulnerability scan is MOST accurate but requires login privileges to the target?",
    options: { A: "Unauthenticated external scan", B: "Authenticated (credentialed) scan", C: "Passive network sniffing", D: "Banner grabbing only" },
    correct: "B",
    explanation: "Credentialed scans see installed packages, configs, and patch state, dramatically reducing false negatives.",
    wrongHint: { letter: "A", text: "Unauthenticated scans miss many internally observable vulnerabilities." } },

  { num: 54, domain: "Domain 4.6 — Auth Factors", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which authentication factor category does a fingerprint scan represent?",
    options: { A: "Something you know", B: "Something you have", C: "Something you are", D: "Somewhere you are" },
    correct: "C",
    explanation: "Biometrics are the \"something you are\" factor.",
    wrongHint: { letter: "D", text: "Location-based factors (geofencing) are sometimes used but are distinct from biometrics." } },

  { num: 55, domain: "Domain 4.6 — SSO", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Users authenticate once and receive access to multiple internal applications without re-entering credentials. What is this capability called?",
    options: { A: "Federation", B: "Single Sign-On (SSO)", C: "Step-up authentication", D: "Just-in-time provisioning" },
    correct: "B",
    explanation: "SSO authenticates once within a trust boundary and propagates the session across apps.",
    wrongHint: { letter: "A", text: "Federation extends SSO across organizational/identity boundaries; SSO is the broader term used here." } },

  { num: 56, domain: "Domain 4.6 — JIT Privilege", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Engineers occasionally need elevated rights for emergency production tasks but should not retain them between incidents. Which control BEST fits?",
    options: { A: "Permanent shared admin account", B: "Just-in-Time (JIT) privileged access with approval and time-boxed elevation", C: "Storing the admin password in a wiki", D: "Static MAC labels on workstations" },
    correct: "B",
    explanation: "JIT grants time-bound elevation only when needed, removing standing privilege.",
    wrongHint: { letter: "A", text: "Shared standing admin accounts violate accountability and least privilege." } },

  { num: 57, domain: "Domain 4.1 — TACACS+", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which AAA protocol uses TCP, encrypts the entire packet payload, and separates authentication, authorization, and accounting?",
    options: { A: "RADIUS", B: "Kerberos", C: "TACACS+", D: "LDAP" },
    correct: "C",
    explanation: "TACACS+ encrypts the full payload and separates AAA functions, commonly used for network device admin.",
    wrongHint: { letter: "A", text: "RADIUS encrypts only the password attribute and uses UDP." } },

  { num: 58, domain: "Domain 4.6 — PAM", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In privileged-access contexts, \"PAM\" most accurately stands for:",
    options: { A: "Personal Access Module", B: "Privileged Access Management", C: "Public Access Method", D: "Protected Account Mediator" },
    correct: "B",
    explanation: "PAM platforms vault credentials, broker sessions, and record activity for high-privilege accounts.",
    wrongHint: { letter: "A", text: "\"Personal Access Module\" (Pluggable Authentication Modules) is a Linux library — close-sounding but not the privileged access concept." } },

  { num: 59, domain: "Domain 4.1 — Change Management", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "An organization mandates documented review and approval before any production change. This control supports which discipline?",
    options: { A: "Continuous integration", B: "Change management", C: "Incident response", D: "Threat modeling" },
    correct: "B",
    explanation: "Change management governs proposed modifications, balancing agility with risk.",
    wrongHint: { letter: "C", text: "IR addresses unplanned events, not planned changes." } },

  { num: 60, domain: "Domain 4.3 — Patch Testing", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the BEST way to validate that a vendor patch will not break production before broad rollout?",
    options: { A: "Push directly to all production systems", B: "Test in a representative non-production (staging) environment", C: "Skip testing for \"critical\" patches to save time", D: "Apply only to one developer's laptop" },
    correct: "B",
    explanation: "Staging environments mirror production sufficiently to surface regressions safely.",
    wrongHint: { letter: "A", text: "Direct production deployment is widely documented as poor practice." } },

  { num: 61, domain: "Domain 4.7 — DNS Tunneling", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which log source would BEST help investigate suspected DNS tunneling exfiltration?",
    options: { A: "NTP server logs", B: "Recursive DNS query logs", C: "DHCP lease logs", D: "BGP route updates" },
    correct: "B",
    explanation: "DNS query logs reveal abnormally long, high-entropy, or high-frequency queries indicative of tunneling.",
    wrongHint: { letter: "C", text: "DHCP logs identify IP-to-MAC bindings but do not show DNS query content." } },

  { num: 62, domain: "Domain 4.7 — Order of Volatility", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Investigators need to capture system memory before powering off a compromised host so volatile artifacts are preserved. This adheres to which forensic principle?",
    options: { A: "Order of volatility", B: "Chain of custody", C: "Legal hold notification", D: "Right-to-audit" },
    correct: "A",
    explanation: "Order of volatility prioritizes capturing the most ephemeral evidence first (CPU/RAM before disk).",
    wrongHint: { letter: "B", text: "Chain of custody documents handling history; it does not dictate capture order." } },

  { num: 63, domain: "Domain 4.7 — Chain of Custody", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which document tracks every person who handled a piece of evidence, when, and why — preserving its admissibility in court?",
    options: { A: "Forensic disk image", B: "Chain of custody form", C: "Capture-the-flag scoring log", D: "Business impact analysis" },
    correct: "B",
    explanation: "Chain of custody is the unbroken, signed record that evidence has not been tampered with.",
    wrongHint: { letter: "A", text: "The image is the evidence itself; it does not track handling." } },

  { num: 64, domain: "Domain 4.5 — EDR", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] EDR platforms PRIMARILY provide:",
    options: { A: "Disk-at-rest encryption for laptops", B: "Endpoint detection, behavioral analytics, and response capabilities", C: "Replacement for perimeter firewalls", D: "Centralized patch distribution" },
    correct: "B",
    explanation: "Endpoint Detection and Response tools continuously monitor host behavior and enable investigation/containment actions.",
    wrongHint: { letter: "A", text: "Disk encryption is provided by tools like BitLocker/FileVault, not by EDR." } },

  { num: 65, domain: "Domain 4.1 — Application Allowlisting", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which technology blocks any executable that is NOT explicitly approved by policy from running on an endpoint?",
    options: { A: "Application allowlisting (whitelisting)", B: "Honeynet", C: "Port mirroring", D: "Tap segmentation" },
    correct: "A",
    explanation: "Allowlisting permits only approved binaries, defeating most unknown malware.",
    wrongHint: { letter: "B", text: "Honeynets are decoy environments, not execution controls." } },

  { num: 66, domain: "Domain 4.6 — HOTP vs TOTP", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which one-time-password method derives codes from a counter that increments with each use rather than from the wall clock?",
    options: { A: "TOTP", B: "HOTP", C: "U2F", D: "FIDO2 passkey" },
    correct: "B",
    explanation: "HOTP (HMAC-based OTP, RFC 4226) is counter-based; TOTP is time-based.",
    wrongHint: { letter: "A", text: "TOTP advances based on time intervals (typically 30 seconds), not a counter." } },

  { num: 67, domain: "Domain 4.1 — SSH", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which secure protocol is the standard replacement for Telnet for remote shell administration?",
    options: { A: "FTP", B: "SSH", C: "SNMPv1", D: "HTTP" },
    correct: "B",
    explanation: "SSH provides encrypted, authenticated remote shell access on TCP/22.",
    wrongHint: { letter: "A", text: "FTP transfers files in cleartext and is itself a deprecated protocol." } },

  { num: 68, domain: "Domain 4.3 — Risk-Based Prioritization", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) After receiving a 200-finding scan report, an analyst ranks remediation by exploitability, exposure, and business impact. Which activity is this?",
    options: { A: "Remediation deployment", B: "Risk-based vulnerability prioritization", C: "Threat hunting", D: "Penetration testing" },
    correct: "B",
    explanation: "Risk-based prioritization weighs the asset's importance and the vulnerability's exploitability rather than CVSS alone.",
    wrongHint: { letter: "C", text: "Threat hunting proactively searches for unknown threats; it does not rank existing scan findings." } },

  { num: 69, domain: "Domain 4.2 — Threat Hunting", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the term for proactively searching environments for undetected adversary activity using hypotheses about TTPs?",
    options: { A: "Threat hunting", B: "Vulnerability scanning", C: "Compliance auditing", D: "Static application security testing" },
    correct: "A",
    explanation: "Threat hunting starts with hypotheses (e.g., MITRE ATT&CK techniques) and seeks evidence in telemetry.",
    wrongHint: { letter: "B", text: "Scanning is reactive to known signatures, not hypothesis-driven hunting." } },

  { num: 70, domain: "Domain 4.2 — STIX", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] STIX is BEST described as:",
    options: { A: "A scripting language for SOAR playbooks", B: "A standardized, structured language for representing cyber threat intelligence", C: "A scanning tool for endpoint vulnerabilities", D: "A SIEM-vendor proprietary log format" },
    correct: "B",
    explanation: "STIX (Structured Threat Information eXpression), often paired with TAXII, encodes CTI for sharing.",
    wrongHint: { letter: "D", text: "STIX is an open OASIS standard, not a vendor-specific format." } },

  { num: 71, domain: "Domain 4.4 — Recovery", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) After a malware outbreak, the IR team rebuilds infected hosts from gold images and validates integrity before returning them to service. Which IR phase is this?",
    options: { A: "Containment", B: "Eradication", C: "Recovery", D: "Preparation" },
    correct: "C",
    explanation: "Recovery returns systems to a clean operating state after eradication.",
    wrongHint: { letter: "B", text: "Eradication removes the threat; rebuilding/validating for return-to-service is recovery." } },

  { num: 72, domain: "Domain 4.1 — Email Transport Security", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which protocol option BEST secures email transport between mail servers?",
    options: { A: "POP3 on port 110", B: "IMAP on port 143", C: "SMTP with STARTTLS / SMTPS", D: "SNMP traps" },
    correct: "C",
    explanation: "STARTTLS upgrades the SMTP session to TLS, encrypting server-to-server mail transport.",
    wrongHint: { letter: "A", text: "POP3/110 is unencrypted client retrieval, not server-to-server transport." } },

  { num: 73, domain: "Domain 5.1 — SLA", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which document defines the minimum acceptable levels of service (uptime, response time, etc.) between two parties?",
    options: { A: "NDA", B: "MOU", C: "SLA", D: "MSA" },
    correct: "C",
    explanation: "A Service Level Agreement quantifies expected service performance and penalties.",
    wrongHint: { letter: "B", text: "An MOU records mutual intent but is non-binding and lacks SLA-level metrics." } },

  { num: 74, domain: "Domain 5.1 — Data Retention", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "What governance artifact specifies how long records must be kept and when they must be destroyed?",
    options: { A: "Acceptable Use Policy", B: "Data retention and disposal policy", C: "Code of conduct", D: "Onboarding checklist" },
    correct: "B",
    explanation: "Data retention/disposal policies define lifecycle requirements often driven by law and contract.",
    wrongHint: { letter: "A", text: "AUPs govern user behavior, not record lifecycles." } },

  { num: 75, domain: "Domain 5.2 — Risk Acceptance", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A risk owner reviews a low-likelihood, low-impact risk that falls below the organization's defined tolerance and formally documents a decision to take no further action. This is an example of:",
    options: { A: "Risk avoidance", B: "Risk acceptance", C: "Risk transfer", D: "Risk mitigation" },
    correct: "B",
    explanation: "Acceptance is the conscious, documented choice to live with a risk that falls under tolerance.",
    wrongHint: { letter: "A", text: "Avoidance eliminates the activity producing the risk; here the activity continues." } },

  { num: 76, domain: "Domain 5.4 — PII", domainNum: 5, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] PII most directly refers to:",
    options: { A: "Public Internet Identifiers", B: "Personally Identifiable Information", C: "Privileged Insider Indicators", D: "Protected Industrial Information" },
    correct: "B",
    explanation: "PII is data that can identify a specific individual, governed by laws like GDPR and various U.S. state laws.",
    wrongHint: { letter: "D", text: "\"Protected Industrial Information\" sounds plausible but is not the regulatory term." } },

  { num: 77, domain: "Domain 5.2 — SLE", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which calculation expresses the expected loss from a SINGLE occurrence of a risk event?",
    options: { A: "ALE", B: "SLE", C: "ARO", D: "RPO" },
    correct: "B",
    explanation: "Single Loss Expectancy = Asset Value × Exposure Factor.",
    wrongHint: { letter: "A", text: "ALE = SLE × ARO, which is annualized, not per-event." } },

  { num: 78, domain: "Domain 5.2 — Risk Transfer", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "A company purchases cyber insurance to cover potential breach costs. Which risk treatment strategy is this?",
    options: { A: "Avoidance", B: "Mitigation", C: "Transfer", D: "Acceptance" },
    correct: "C",
    explanation: "Insurance transfers financial risk to a third party.",
    wrongHint: { letter: "B", text: "Mitigation reduces likelihood or impact directly via controls; insurance does not change either." } },

  { num: 79, domain: "Domain 5.5 — External Audit", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which assessment type is performed by an INDEPENDENT external party to provide objective verification of compliance to stakeholders?",
    options: { A: "Internal audit", B: "Self-assessment", C: "Third-party / external audit", D: "Penetration test" },
    correct: "C",
    explanation: "External audits provide independent assurance, often required by regulators or customers.",
    wrongHint: { letter: "A", text: "Internal audits provide management assurance but lack external independence." } },

  { num: 80, domain: "Domain 5.5 — Vendor Risk", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Before granting a SaaS vendor access to customer data, the security team reviews their SOC 2 Type II report, security questionnaire, and contractual safeguards. This is part of:",
    options: { A: "Incident response", B: "Vendor / third-party risk management", C: "Disaster recovery", D: "Patch management" },
    correct: "B",
    explanation: "Vendor/TPRM evaluates external parties' security posture before and during engagement.",
    wrongHint: { letter: "A", text: "IR addresses events that have occurred, not vendor onboarding." } },

  { num: 81, domain: "Domain 5.4 — HIPAA", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which U.S. regulation primarily governs the privacy and security of protected health information?",
    options: { A: "GDPR", B: "HIPAA", C: "PCI DSS", D: "SOX" },
    correct: "B",
    explanation: "HIPAA's Privacy and Security Rules cover PHI handled by covered entities and business associates.",
    wrongHint: { letter: "A", text: "GDPR covers EU personal data broadly; PHI in the U.S. is HIPAA's domain." } },

  { num: 82, domain: "Domain 5.4 — PHI", domainNum: 5, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] PHI is regulated PRIMARILY by which framework in the United States?",
    options: { A: "GDPR", B: "HIPAA", C: "GLBA", D: "FERPA" },
    correct: "B",
    explanation: "HIPAA defines and protects Protected Health Information (PHI) in U.S. healthcare contexts.",
    wrongHint: { letter: "C", text: "GLBA governs financial data, not health data." } },

  { num: 83, domain: "Domain 5.6 — Phishing Awareness", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which approach is MOST effective at sustainably reducing successful phishing attacks against employees?",
    options: { A: "A single annual compliance training video", B: "Ongoing security awareness paired with simulated phishing campaigns and feedback", C: "A new-hire orientation slide referenced once", D: "Mandatory monthly password rotation" },
    correct: "B",
    explanation: "Reinforcement plus realistic practice produces lasting behavior change; one-off content does not.",
    wrongHint: { letter: "D", text: "Frequent password rotation is now discouraged by NIST SP 800-63B and does not address phishing." } },

  { num: 84, domain: "Domain 5.1 — MOU", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Two organizations sharing a research project want to document their mutual goals and responsibilities, with no legally binding obligation. Which document fits BEST?",
    options: { A: "SLA", B: "BPA", C: "MOU", D: "NDA" },
    correct: "C",
    explanation: "Memoranda of Understanding express intent and shared expectations without creating binding contractual duties.",
    wrongHint: { letter: "B", text: "Business Partnership Agreements create legally binding partnership terms." } },

  { num: 85, domain: "Domain 5.5 — Right-to-Audit", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which contractual clause grants a customer the ability to inspect or audit a vendor's controls?",
    options: { A: "Indemnification clause", B: "Right-to-audit clause", C: "Limitation of liability", D: "Force majeure" },
    correct: "B",
    explanation: "Right-to-audit clauses are essential for verifying vendor security commitments.",
    wrongHint: { letter: "A", text: "Indemnification allocates legal cost responsibility, not inspection rights." } },

  { num: 86, domain: "Domain 5.2 — Risk Register", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "An organization's risk register lists each risk's likelihood, impact, owner, and treatment. The register's PRIMARY purpose is to:",
    options: { A: "Replace cyber insurance policies", B: "Provide a living view to track and manage identified risks over time", C: "Document only past incidents", D: "Define password complexity rules" },
    correct: "B",
    explanation: "A risk register is the central, ongoing tracking artifact for the risk-management program.",
    wrongHint: { letter: "C", text: "Past incidents are tracked separately in incident logs; the register is forward-looking." } },

  { num: 87, domain: "Domain 5.6 — Whaling Targets", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which group is OFTEN targeted by social-engineering attacks (whaling, BEC) and therefore needs role-specific awareness training?",
    options: { A: "Junior IT administrators only", B: "Executives and finance/AP staff", C: "Only the SOC team", D: "Software developers exclusively" },
    correct: "B",
    explanation: "Executives and finance/AP roles have authority over funds and information that attackers monetize directly.",
    wrongHint: { letter: "A", text: "Admins are also targeted, but the question highlights whaling and BEC, which specifically target executives and finance." } },

  { num: 88, domain: "Domain 5.5 — NDA", domainNum: 5, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] An NDA between two parties is PRIMARILY intended to:",
    options: { A: "Replace a service-level agreement", B: "Protect confidential information shared between parties", C: "Define application uptime metrics", D: "Define on-call escalation paths" },
    correct: "B",
    explanation: "Non-Disclosure Agreements legally bind parties to protect confidential information.",
    wrongHint: { letter: "A", text: "SLAs and NDAs serve completely different purposes." } },

  { num: 89, domain: "Domain 5.3 — NIST 800-53", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which framework provides a comprehensive catalog of security and privacy controls and is widely used by U.S. federal systems and contractors?",
    options: { A: "ISO/IEC 27001", B: "NIST SP 800-53", C: "PCI DSS", D: "CIS Critical Security Controls v8" },
    correct: "B",
    explanation: "NIST SP 800-53 is the federal control catalog, mandated under FISMA via NIST SP 800-37 (RMF).",
    wrongHint: { letter: "A", text: "ISO 27001 is widely used but it's an ISMS standard with controls in Annex A / ISO 27002, not a U.S. federal mandate." } },

  { num: 90, domain: "Domain 5.2 — Cost-Benefit Risk Decision", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A CISO must decide whether to implement a $500K control to mitigate a risk with an Annualized Loss Expectancy (ALE) of $80K and no regulatory requirement to do so. The MOST defensible quantitative decision is to:",
    options: { A: "Implement the control regardless of cost", B: "Reject the proposed control because the cost far exceeds the expected loss; explore cheaper alternatives or accept the risk", C: "Outsource all operations to remove the risk", D: "Ignore the risk and remove it from the register" },
    correct: "B",
    explanation: "A defensible decision balances control cost against expected loss; spending $500K to prevent $80K/yr fails cost-benefit absent other drivers.",
    wrongHint: { letter: "A", text: "Implementing controls without economic justification wastes scarce security budget that could reduce higher-impact risks." } },

  // =========================================================================
  // Pool expansion (Q91+): variations on the original 90 plus additional
  // angles on the same SY0-701 objectives. Preserves the official domain
  // weighting so any random subset still mirrors the blueprint distribution.
  // =========================================================================

  // ---- Domain 1 expansion (+7) ----
  { num: 91, domain: "Domain 1.1 — Control Categories", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "Full-disk encryption deployed via BitLocker on every laptop is BEST classified as which control category?",
    options: { A: "Managerial", B: "Operational", C: "Technical", D: "Physical" },
    correct: "C",
    explanation: "Encryption is enforced by technology, making it a technical (logical) control.",
    wrongHint: { letter: "B", text: "Operational controls are people-driven (e.g., guards, training delivery), not technology-enforced." } },

  { num: 92, domain: "Domain 1.2 — CIA Triad", domainNum: 1, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A volumetric DDoS attack saturates the public-facing API and legitimate users can no longer reach the service. Which CIA property is PRIMARILY violated?",
    options: { A: "Confidentiality", B: "Integrity", C: "Availability", D: "Non-repudiation" },
    correct: "C",
    explanation: "Denial-of-service attacks degrade availability — the assurance that systems and data are usable when needed.",
    wrongHint: { letter: "B", text: "Integrity is unaffected; the data is unchanged, just unreachable." } },

  { num: 93, domain: "Domain 1.4 — MFA", domainNum: 1, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] Which expansion of MFA is correct?",
    options: { A: "Managed Firewall Audit", B: "Multi-Factor Authentication", C: "Multi-Forest Authorization", D: "Mandatory File Access" },
    correct: "B",
    explanation: "MFA = Multi-Factor Authentication — combining factors from at least two different categories (know/have/are/where/do).",
    wrongHint: { letter: "C", text: "Multi-Forest Authorization is not a standard term; it conflates AD-forest with MFA semantics." } },

  { num: 94, domain: "Domain 1.3 — Change Management", domainNum: 1, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A critical zero-day patch must be applied to internet-facing servers within the next two hours. Which change-management track is appropriate?",
    options: { A: "Standard change with a 14-day CAB review", B: "Emergency change with expedited approval and post-implementation review", C: "Skip change management entirely; this is an outage", D: "Defer until the next quarterly maintenance window" },
    correct: "B",
    explanation: "Emergency changes have an accelerated approval path with post-implementation review documented later — control is still maintained.",
    wrongHint: { letter: "C", text: "Bypassing change management entirely loses traceability and may create audit findings." } },

  { num: 95, domain: "Domain 1.4 — PKI Hierarchy", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "Why do most organizations issue end-entity certificates from an intermediate CA rather than directly from the offline root CA?",
    options: { A: "Intermediate CAs run faster than root CAs", B: "It limits the blast radius if a signing CA is compromised — only the intermediate (not the root) must be revoked", C: "Browsers reject certificates signed by root CAs", D: "It removes the need for a CRL" },
    correct: "B",
    explanation: "Keeping the root CA offline and signing via intermediates means a compromised intermediate can be revoked without invalidating the root trust anchor.",
    wrongHint: { letter: "C", text: "Browsers do trust root-CA-signed certs in principle; issuance via intermediates is operational, not a browser requirement." } },

  { num: 96, domain: "Domain 1.4 — AAA", domainNum: 1, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In identity and access management, AAA stands for which three functions?",
    options: { A: "Audit, Approval, Authorization", B: "Authentication, Authorization, Accounting", C: "Access, Authority, Accountability", D: "Authentication, Auditing, Approval" },
    correct: "B",
    explanation: "AAA = Authentication (who you are), Authorization (what you can do), Accounting (what you did). RADIUS and TACACS+ implement AAA.",
    wrongHint: { letter: "C", text: "Accountability is a related concept, but the canonical CompTIA AAA expansion is Authentication / Authorization / Accounting." } },

  { num: 97, domain: "Domain 1.4 — Hashing vs Encryption", domainNum: 1, acronym: false, scenario: false, selectMulti: false,
    stem: "Which property differentiates a cryptographic hash function from symmetric encryption?",
    options: { A: "Hashes use longer keys than encryption", B: "Hashes are one-way and produce a fixed-length digest; encryption is reversible with the key", C: "Encryption is faster than hashing", D: "Hashes guarantee confidentiality of the input" },
    correct: "B",
    explanation: "Hashes (SHA-256, etc.) are one-way and fixed-length; encryption is reversible given the key. Hashing protects integrity, encryption protects confidentiality.",
    wrongHint: { letter: "D", text: "Hashes do not provide confidentiality — they are designed to be deterministic and one-way, not secret." } },

  // ---- Domain 2 expansion (+12) ----
  { num: 98, domain: "Domain 2.5 — Stack Canaries", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which compile-time mitigation places a known sentinel value between the local stack frame and the saved return address to detect classic stack-smashing buffer overflows?",
    options: { A: "ASLR", B: "DEP/NX", C: "Stack canaries", D: "Control Flow Guard (CFG)" },
    correct: "C",
    explanation: "Stack canaries (a.k.a. stack cookies) catch overflow corruption when the canary value changes before function return.",
    wrongHint: { letter: "A", text: "ASLR randomizes addresses but does not detect a canary corruption." } },

  { num: 99, domain: "Domain 2.2 — Phishing Indicators", domainNum: 2, acronym: false, scenario: false, selectMulti: true,
    stem: "[SELECT TWO] Which indicators MOST strongly suggest a message is a phishing attempt?",
    options: { A: "An urgent demand for action with a threat of consequences", B: "Use of a known internal employee directory listing", C: "A mismatched sender domain that resembles but does not match the organization's", D: "Email signed with the company's DKIM-aligned domain", E: "Plain-text greeting with the user's full name" },
    correct: ["A", "C"],
    explanation: "Manufactured urgency and lookalike sender domains are classic phishing red flags. DKIM-aligned signatures and accurate internal directory data are typically legitimate signals.",
    wrongHint: { letter: "D", text: "DKIM alignment proves the sender domain authorized the message — that's a legitimacy signal, not a phishing indicator." } },

  { num: 100, domain: "Domain 2.2 — Insider Threat", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) An employee preparing to resign suddenly downloads thousands of customer-list records to a personal USB drive after hours. Which threat actor type does this BEST illustrate?",
    options: { A: "Hacktivist", B: "Nation-state APT", C: "Malicious insider", D: "Script kiddie" },
    correct: "C",
    explanation: "Authorized users abusing their legitimate access to exfiltrate data are malicious insiders.",
    wrongHint: { letter: "B", text: "Nation-state APTs are external sophisticated actors; the access pattern here is a privileged employee." } },

  { num: 101, domain: "Domain 2.4 — Race Condition", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Time-of-check / time-of-use (TOCTOU) flaws are a class of which broader vulnerability?",
    options: { A: "Buffer overflow", B: "Race condition", C: "Cross-site scripting", D: "SQL injection" },
    correct: "B",
    explanation: "TOCTOU exploits the gap between checking a resource's state and using it — a textbook race condition.",
    wrongHint: { letter: "A", text: "Buffer overflows overrun memory boundaries; TOCTOU is a timing/concurrency flaw." } },

  { num: 102, domain: "Domain 2.4 — Watering Hole", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) An adversary compromises an industry-association website that engineers in a target sector frequently visit, embedding an exploit kit that fires only on visits from those engineers' IP ranges. Which attack technique is this?",
    options: { A: "Spear phishing", B: "Watering-hole attack", C: "Typosquatting", D: "Drive-by NFC" },
    correct: "B",
    explanation: "A watering-hole attack compromises a site the target audience trusts and waits for them to come to it.",
    wrongHint: { letter: "A", text: "Spear phishing requires sending a tailored message to the victim; watering-hole attacks are passive on the compromised site." } },

  { num: 103, domain: "Domain 2.4 — DNS Poisoning", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which protocol is designed PRIMARILY to defend resolvers against forged DNS responses by validating signatures on records?",
    options: { A: "DNSSEC", B: "DoT (DNS-over-TLS)", C: "DoH (DNS-over-HTTPS)", D: "EDNS Client Subnet" },
    correct: "A",
    explanation: "DNSSEC adds origin authentication and integrity to DNS responses through a chain of digital signatures.",
    wrongHint: { letter: "B", text: "DoT/DoH encrypt DNS in transit but do not authenticate the records themselves the way DNSSEC does." } },

  { num: 104, domain: "Domain 2.2 — DDoS", domainNum: 2, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] DDoS expands to:",
    options: { A: "Distributed Denial of Service", B: "Direct Defense of Server", C: "Domain Discovery on Subnet", D: "Dual-Stack Distribution Service" },
    correct: "A",
    explanation: "Distributed Denial of Service — many sources flooding a target to exhaust capacity (bandwidth, sessions, CPU).",
    wrongHint: { letter: "C", text: "C is a fabricated phrase; DDoS is a denial-of-service technique, not a discovery one." } },

  { num: 105, domain: "Domain 2.2 — Smishing", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A user receives a text message claiming to be from the bank, with a shortened URL asking them to verify recent activity. Which social-engineering technique is this?",
    options: { A: "Vishing", B: "Smishing", C: "Whaling", D: "Pretexting (general)" },
    correct: "B",
    explanation: "SMS-based phishing is smishing — phishing delivered over text messaging.",
    wrongHint: { letter: "A", text: "Vishing is voice/phone phishing; the channel here is SMS, making it smishing." } },

  { num: 106, domain: "Domain 2.4 — Privilege Escalation", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "An attacker who has compromised a low-privileged user account exploits a kernel flaw to obtain SYSTEM/root rights. Which technique class is this?",
    options: { A: "Lateral movement", B: "Vertical privilege escalation", C: "Horizontal privilege escalation", D: "Pass-the-hash" },
    correct: "B",
    explanation: "Gaining higher rights on the same host is vertical privilege escalation. Horizontal is moving to a peer's account at the same privilege level.",
    wrongHint: { letter: "C", text: "Horizontal escalation moves between equal-privilege accounts; the question describes elevation to SYSTEM/root." } },

  { num: 107, domain: "Domain 2.5 — Heap vs Stack Overflow", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement BEST distinguishes a heap overflow from a stack overflow?",
    options: { A: "Heap overflows occur in dynamically allocated memory; stack overflows corrupt local frames and saved return addresses", B: "Heap overflows only happen in interpreted languages", C: "Stack overflows cannot lead to code execution", D: "Heap overflows require root privileges to trigger" },
    correct: "A",
    explanation: "Stack overflows clobber the saved return pointer; heap overflows corrupt allocator metadata or adjacent objects in dynamic memory.",
    wrongHint: { letter: "C", text: "Classic stack overflows famously enabled remote code execution before mitigations like ASLR/DEP/canaries became default." } },

  { num: 108, domain: "Domain 2.4 — CSRF", domainNum: 2, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A logged-in user clicks a malicious link that causes their browser to silently submit a state-changing request to a banking site using their existing session cookie. Which attack class is this?",
    options: { A: "Stored XSS", B: "Cross-site request forgery (CSRF)", C: "Session fixation", D: "Open redirect" },
    correct: "B",
    explanation: "CSRF rides the user's authenticated session to perform actions they did not intend; mitigated with anti-CSRF tokens and SameSite cookies.",
    wrongHint: { letter: "A", text: "XSS injects script in the victim's browser context; CSRF abuses an existing authenticated session for unintended actions." } },

  { num: 109, domain: "Domain 2.5 — Sandboxing", domainNum: 2, acronym: false, scenario: false, selectMulti: false,
    stem: "Which control isolates a suspicious file by executing it in a constrained environment that intercepts its behavior?",
    options: { A: "Network segmentation", B: "Application sandboxing / detonation", C: "Endpoint whitelisting", D: "Patch management" },
    correct: "B",
    explanation: "Sandboxes (e.g., malware detonation services) run untrusted code in a controlled environment and observe its behavior.",
    wrongHint: { letter: "C", text: "Whitelisting prevents unknown binaries from running but does not analyze them in a sandbox." } },

  // ---- Domain 3 expansion (+10) ----
  { num: 110, domain: "Domain 3.2 — SASE", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In modern cloud-edge security, SASE most accurately stands for:",
    options: { A: "Secure Access Service Edge", B: "Server-Authenticated Secure Endpoint", C: "Single Account Sign-on Edge", D: "Stateful Application Session Engine" },
    correct: "A",
    explanation: "SASE converges SD-WAN with cloud-delivered security (SWG, CASB, ZTNA, FWaaS) at the edge, enforced near the user.",
    wrongHint: { letter: "C", text: "Single sign-on is unrelated; SASE is an architecture pattern, not a sign-on protocol." } },

  { num: 111, domain: "Domain 3.2 — SD-WAN", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY security and operational benefit of SD-WAN over traditional MPLS-only branch connectivity?",
    options: { A: "Eliminates the need for any encryption", B: "Centralized policy and dynamic path selection across multiple transports (MPLS, broadband, LTE)", C: "Removes the need for branch routers", D: "Replaces firewalls with switches" },
    correct: "B",
    explanation: "SD-WAN abstracts the underlying transports and centralizes policy, enabling cost-effective multi-link architectures with consistent security.",
    wrongHint: { letter: "A", text: "SD-WAN typically uses IPsec overlays — encryption is still essential." } },

  { num: 112, domain: "Domain 3.2 — Containers vs VMs", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement BEST describes the security boundary difference between a VM and a container?",
    options: { A: "Containers are stronger isolation than VMs", B: "VMs share a kernel with the host; containers do not", C: "VMs enforce isolation at the hypervisor; containers share the host kernel and rely on namespaces/cgroups", D: "There is no difference" },
    correct: "C",
    explanation: "Hypervisor-based VM isolation is generally stronger than container isolation, which depends on Linux namespaces and cgroups sharing one kernel.",
    wrongHint: { letter: "A", text: "It's the opposite — VMs typically provide a stronger isolation boundary than containers." } },

  { num: 113, domain: "Domain 3.2 — Microsegmentation", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY security benefit of microsegmentation in a data center or cloud VPC?",
    options: { A: "Lower IP-address consumption", B: "Restricts east-west traffic between workloads to least-privilege flows", C: "Replaces the need for endpoint protection", D: "Removes the need for IAM policies" },
    correct: "B",
    explanation: "Microsegmentation enforces per-workload policy so a compromised host cannot freely reach peer workloads (limits lateral movement).",
    wrongHint: { letter: "A", text: "Microsegmentation is a security control, not an addressing optimization." } },

  { num: 114, domain: "Domain 3.1 — Cloud SaaS Responsibility", domainNum: 3, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) An organization adopts a SaaS HR platform. Which security responsibility BEST remains with the customer rather than the SaaS provider?",
    options: { A: "Patching the underlying VM operating systems", B: "Hypervisor management", C: "User access management, data classification, and configuration of tenant security settings", D: "Physical-data-center access controls" },
    correct: "C",
    explanation: "In SaaS, customers retain responsibility for their data, identities, and tenant configuration; the provider handles the platform/infra.",
    wrongHint: { letter: "A", text: "OS patching of provider infrastructure is the SaaS provider's responsibility." } },

  { num: 115, domain: "Domain 3.2 — CASB", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] Which technology category does CASB describe?",
    options: { A: "A device that consolidates router + switch in one chassis", B: "Cloud Access Security Broker — policy enforcement between users and SaaS apps", C: "Confidential Application Sandbox Boundary", D: "Centralized Authentication Service Bus" },
    correct: "B",
    explanation: "CASBs sit between users and SaaS providers (inline, API, or both) to enforce DLP, access, and threat-protection policies.",
    wrongHint: { letter: "D", text: "Authentication brokers exist (e.g., IdPs) but CASB is specifically the cloud-app security control plane." } },

  { num: 116, domain: "Domain 3.2 — TLS Handshake", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "What does the TLS handshake establish between client and server?",
    options: { A: "Just the application-layer URL", B: "An authenticated, integrity-protected session with negotiated cipher suite and shared keys", C: "A persistent layer-2 frame tunnel", D: "Only server identity, with no key material" },
    correct: "B",
    explanation: "The handshake authenticates the server (and optionally client), negotiates cipher suite and protocol version, and derives session keys.",
    wrongHint: { letter: "D", text: "Modern TLS handshakes derive ephemeral session keys via (EC)DHE; identity verification alone is incomplete." } },

  { num: 117, domain: "Domain 3.2 — VPN Split Tunneling", domainNum: 3, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A remote-work VPN is configured so that only traffic destined to corporate networks goes through the tunnel; everything else egresses directly. Which configuration is described, and what is its main security trade-off?",
    options: { A: "Full tunnel — every flow inspected by corporate controls", B: "Split tunneling — improves performance but bypasses corporate inspection for non-corporate traffic", C: "Always-on VPN — eliminates split tunnel concerns automatically", D: "Reverse VPN — outbound only" },
    correct: "B",
    explanation: "Split tunneling reduces VPN/WAN load and latency for external traffic but means that traffic isn't inspected by corporate proxies/IDS.",
    wrongHint: { letter: "A", text: "Full-tunnel forces all traffic through corporate controls; the question describes only corporate-bound traffic in the tunnel." } },

  { num: 118, domain: "Domain 3.2 — SDN Controller", domainNum: 3, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the role of the controller in a Software-Defined Networking (SDN) architecture?",
    options: { A: "Forwards every data-plane packet at line rate", B: "Centralizes the control plane and programs forwarding rules into distributed switches", C: "Replaces the need for firewalls", D: "Acts as the primary endpoint NAC" },
    correct: "B",
    explanation: "SDN separates control and data planes; the controller centralizes policy/topology and pushes flows down to programmable switches.",
    wrongHint: { letter: "A", text: "Forwarding stays in the data-plane switches; the controller is a control-plane element, not a packet forwarder." } },

  { num: 119, domain: "Domain 3.2 — TPM", domainNum: 3, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] What is a TPM and what does it provide?",
    options: { A: "Trusted Platform Module — a hardware root of trust used for measured boot, key sealing, and attestation", B: "Total Process Monitor — a kernel scheduler", C: "Tamper-Proof Memory — RAM dedicated to encrypted swap", D: "Transactional Persistence Manager — a database engine" },
    correct: "A",
    explanation: "The TPM is a discrete or firmware chip that provides cryptographic functions, secure key storage, PCR-based measurement, and remote attestation.",
    wrongHint: { letter: "C", text: "TPMs are not RAM; they're a tamper-resistant cryptographic processor." } },

  // ---- Domain 4 expansion (+15) ----
  { num: 120, domain: "Domain 4.5 — Patch Management", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Critical CVE patches are released on the second Tuesday of each month. The team applies them to a staging tier first, monitors for issues, then promotes them to production within five business days. Which discipline is described?",
    options: { A: "Continuous integration", B: "Patch management with phased rollout", C: "Configuration management database", D: "Vulnerability disclosure" },
    correct: "B",
    explanation: "A staged, time-bounded rollout from non-production to production is patch-management best practice.",
    wrongHint: { letter: "A", text: "CI is a developer-pipeline practice; patch management is an IT-operations discipline." } },

  { num: 121, domain: "Domain 4.4 — RTO vs RPO", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which definition pair is correct?",
    options: { A: "RTO = maximum allowable data loss, RPO = maximum allowable downtime", B: "RTO = maximum allowable downtime to restore service, RPO = maximum allowable data loss measured in time", C: "RTO and RPO are the same metric measured differently", D: "RTO measures bandwidth, RPO measures latency" },
    correct: "B",
    explanation: "RTO = recovery time objective (how long until service is back). RPO = recovery point objective (how much data, by time, can be lost).",
    wrongHint: { letter: "A", text: "The terms are flipped — RTO measures time-to-restore; RPO measures acceptable data-loss window." } },

  { num: 122, domain: "Domain 4.3 — SIEM", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] What does SIEM stand for?",
    options: { A: "Secure Intrusion Event Monitor", B: "Security Information and Event Management", C: "Signature Interception Engine Module", D: "Server Identity Endpoint Manager" },
    correct: "B",
    explanation: "SIEM platforms aggregate, normalize, correlate, and alert on log/telemetry data across the environment.",
    wrongHint: { letter: "A", text: "Sounds plausible but it's not the canonical expansion." } },

  { num: 123, domain: "Domain 4.3 — Log Correlation", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A SIEM raises a high-severity alert because a single source IP failed authentication 50 times across 12 distinct user accounts within 90 seconds, then succeeded once. Which capability fired the alert?",
    options: { A: "Heuristic email filtering", B: "Cross-source log correlation", C: "Network address translation", D: "DLP fingerprinting" },
    correct: "B",
    explanation: "Correlating events across logs (auth + network + identity) and time windows is the SIEM's core analytic value.",
    wrongHint: { letter: "A", text: "Email filtering targets message content, not authentication-pattern correlation." } },

  { num: 124, domain: "Domain 4.4 — Chain of Custody", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY purpose of maintaining chain of custody during a digital-forensics investigation?",
    options: { A: "Speed up the imaging process", B: "Document who handled evidence, when, and how, so it remains admissible and trustworthy", C: "Reduce the storage required for evidence", D: "Allow remote analysts to bypass write blockers" },
    correct: "B",
    explanation: "Chain of custody preserves evidentiary integrity by tracking every handler and action; gaps can render evidence inadmissible.",
    wrongHint: { letter: "A", text: "Imaging speed is unrelated to provenance documentation." } },

  { num: 125, domain: "Domain 4.3 — SOAR vs SIEM", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement BEST distinguishes SOAR from a traditional SIEM?",
    options: { A: "SIEM only uses signatures while SOAR only uses ML", B: "SOAR adds orchestration, automation, and case-management workflows on top of detection signals", C: "SOAR replaces firewalls", D: "There is no difference" },
    correct: "B",
    explanation: "SOAR (Security Orchestration, Automation, and Response) operationalizes detections into automated playbooks and analyst-assisted case work.",
    wrongHint: { letter: "C", text: "SOAR is an automation/response layer, not a network perimeter device." } },

  { num: 126, domain: "Domain 4.3 — Time Synchronization", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Investigators correlating logs from a firewall, a domain controller, and an EDR sensor find timestamps that disagree by minutes. Which control would have prevented this?",
    options: { A: "Anti-virus signature updates", B: "Centralized NTP time synchronization across all systems", C: "Disk encryption", D: "Egress filtering" },
    correct: "B",
    explanation: "NTP keeps clocks consistent so cross-system event correlation in incident response and forensics is reliable.",
    wrongHint: { letter: "A", text: "AV signatures don't influence event timestamps." } },

  { num: 127, domain: "Domain 4.5 — Application Allowlisting", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which endpoint-hardening control prevents unknown executables from running by default and only permits a curated set of binaries?",
    options: { A: "Application allowlisting (whitelisting)", B: "Antivirus heuristic scanning", C: "DEP/NX", D: "Patch management" },
    correct: "A",
    explanation: "Allowlisting denies by default and only authorizes binaries on a curated list, blocking most novel malware execution.",
    wrongHint: { letter: "B", text: "Heuristics try to detect malicious behavior in run-time, but allow unknown binaries to execute first." } },

  { num: 128, domain: "Domain 4.2 — DLP", domainNum: 4, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] DLP stands for which security control?",
    options: { A: "Distributed Logical Partitioning", B: "Data Loss Prevention", C: "Domain Lookup Provider", D: "Dynamic Latency Probe" },
    correct: "B",
    explanation: "DLP detects and blocks unauthorized movement of sensitive data — at endpoints, in network egress, and in cloud apps.",
    wrongHint: { letter: "C", text: "DNS-related; not the DLP control category." } },

  { num: 129, domain: "Domain 4.3 — Vulnerability Scan vs Pentest", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement BEST distinguishes a vulnerability scan from a penetration test?",
    options: { A: "Pen tests are automated; vulnerability scans are manual", B: "Vulnerability scans identify likely flaws automatically; pen tests attempt to exploit and chain them to demonstrate impact", C: "They are the same activity by different names", D: "Vulnerability scans require physical access; pen tests do not" },
    correct: "B",
    explanation: "Scans enumerate findings (often by signature/version). Pen tests confirm exploitability and demonstrate business impact.",
    wrongHint: { letter: "A", text: "It's the opposite — scans are largely automated; pen tests are largely human-driven." } },

  { num: 130, domain: "Domain 4.5 — NAC Posture", domainNum: 4, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Before a corporate laptop is allowed onto the production VLAN, the access switch checks that the OS is patched, full-disk encryption is on, and the EDR agent is current. Which control is being enforced?",
    options: { A: "Deep packet inspection", B: "Network Access Control (NAC) posture assessment", C: "DDoS protection", D: "Web Application Firewall" },
    correct: "B",
    explanation: "NAC (often 802.1X-based) gates network admission on identity AND endpoint posture/health checks.",
    wrongHint: { letter: "A", text: "DPI inspects payloads in transit; it doesn't gate admission on posture." } },

  { num: 131, domain: "Domain 4.4 — Backup 3-2-1", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "What does the backup '3-2-1 rule' specify?",
    options: { A: "Three full backups per week, two incremental, one synthetic", B: "Three copies of data, on two different media types, with one copy offsite (or offline/immutable)", C: "Three RAID disks plus one spare in two arrays", D: "Three days of retention, two snapshots per day, one weekly archive" },
    correct: "B",
    explanation: "3-2-1 = three copies, on two media, with one offsite/offline (modernly often expanded to 3-2-1-1-0 for immutability and verification).",
    wrongHint: { letter: "A", text: "Backup cadence is operational; the 3-2-1 rule describes copies, media, and location diversity." } },

  { num: 132, domain: "Domain 4.6 — PAM", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which control vaults privileged credentials, brokers session access, and records what privileged users do?",
    options: { A: "Single sign-on (SSO)", B: "Privileged Access Management (PAM)", C: "Mobile Device Management (MDM)", D: "Network Time Protocol (NTP)" },
    correct: "B",
    explanation: "PAM solutions vault, rotate, and broker privileged credentials, and record privileged sessions for accountability.",
    wrongHint: { letter: "A", text: "SSO simplifies regular user login but does not vault and broker privileged credentials specifically." } },

  { num: 133, domain: "Domain 4.4 — IR Containment", domainNum: 4, acronym: false, scenario: true, selectMulti: true,
    stem: "[SELECT TWO] (Scenario) During the containment phase of an active intrusion, which actions are BEST aligned with that phase?",
    options: { A: "Disconnect the affected hosts from the network or move them to a quarantine VLAN", B: "Re-image and return systems to production", C: "Block the attacker's command-and-control IPs at the edge", D: "Hold a lessons-learned meeting", E: "Author new awareness-training content" },
    correct: ["A", "C"],
    explanation: "Containment limits the spread (host quarantine, blocking C2). Re-imaging is eradication/recovery; lessons-learned and training updates come later.",
    wrongHint: { letter: "B", text: "Re-imaging is part of eradication/recovery, not containment." } },

  { num: 134, domain: "Domain 4.5 — Hardening Baselines", domainNum: 4, acronym: false, scenario: false, selectMulti: false,
    stem: "Which artifact provides a vendor-agnostic, prescriptive set of secure configuration settings widely used to harden endpoints and servers?",
    options: { A: "An RFC", B: "A CIS Benchmark", C: "A CVE record", D: "An MSA" },
    correct: "B",
    explanation: "CIS Benchmarks publish consensus-driven secure-configuration guidance for OSes, cloud providers, and applications.",
    wrongHint: { letter: "A", text: "RFCs define protocols; they aren't hardening baselines per se." } },

  // ---- Domain 5 expansion (+11) ----
  { num: 135, domain: "Domain 5.1 — GDPR", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement about GDPR is MOST accurate?",
    options: { A: "Applies only to organizations physically located in the EU", B: "Applies to any organization that processes personal data of individuals in the EU/EEA, regardless of organization location", C: "Applies only to credit-card data", D: "Has no enforcement provisions" },
    correct: "B",
    explanation: "GDPR has extraterritorial scope: any controller/processor handling EU/EEA data subjects' personal data is in scope.",
    wrongHint: { letter: "C", text: "PCI DSS targets cardholder data. GDPR is broader privacy regulation for personal data." } },

  { num: 136, domain: "Domain 5.3 — SOC 2 vs ISO 27001", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which BEST distinguishes SOC 2 from ISO/IEC 27001?",
    options: { A: "SOC 2 is a certification; ISO 27001 is an attestation", B: "SOC 2 is an AICPA attestation report on Trust Services Criteria; ISO/IEC 27001 is an international ISMS certification", C: "They are the same standard", D: "ISO 27001 covers only payment data; SOC 2 covers everything else" },
    correct: "B",
    explanation: "SOC 2 (Type I/II) reports are AICPA attestations against the Trust Services Criteria. ISO 27001 is an international certification of an Information Security Management System.",
    wrongHint: { letter: "A", text: "It's reversed — SOC 2 is an attestation report; ISO 27001 is a certification." } },

  { num: 137, domain: "Domain 5.2 — Risk Register", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which item is LEAST likely to appear in a well-formed risk register entry?",
    options: { A: "Risk description and threat source", B: "Likelihood and impact ratings", C: "Risk owner and treatment decision", D: "Detailed firewall rule numbers" },
    correct: "D",
    explanation: "Risk registers track risk metadata (description, likelihood/impact, owner, treatment, status). Specific firewall-rule line numbers belong in configuration documentation.",
    wrongHint: { letter: "A", text: "Description and threat source are core fields of any risk register." } },

  { num: 138, domain: "Domain 5.2 — ALE Calculation", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) A laptop loss costs $4,000 (SLE). The organization expects two such losses per year (ARO = 2). What is the Annualized Loss Expectancy (ALE)?",
    options: { A: "$2,000", B: "$4,000", C: "$6,000", D: "$8,000" },
    correct: "D",
    explanation: "ALE = SLE × ARO = $4,000 × 2 = $8,000.",
    wrongHint: { letter: "C", text: "$6,000 is SLE × 1.5; the formula is SLE × ARO with ARO = 2." } },

  { num: 139, domain: "Domain 5.4 — BCP", domainNum: 5, acronym: true, scenario: false, selectMulti: false,
    stem: "[ACRONYM] In continuity planning, BCP stands for:",
    options: { A: "Backup Configuration Protocol", B: "Business Continuity Plan", C: "Boundary Control Process", D: "Baseline Compliance Program" },
    correct: "B",
    explanation: "A Business Continuity Plan documents how the organization maintains essential functions during and after a disruption.",
    wrongHint: { letter: "A", text: "Sounds technical but BCP is the continuity-planning artifact." } },

  { num: 140, domain: "Domain 5.4 — BIA vs DR", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which statement BEST distinguishes a Business Impact Analysis (BIA) from a Disaster Recovery (DR) plan?",
    options: { A: "BIA is a runbook; DR is a budget document", B: "BIA identifies critical processes and impact thresholds (RTO/RPO); the DR plan documents how to restore the IT systems supporting them", C: "They are the same artifact", D: "BIA only covers cyber attacks; DR covers natural disasters" },
    correct: "B",
    explanation: "The BIA quantifies impact and feeds RTO/RPO targets; the DR plan operationalizes recovery procedures for those targets.",
    wrongHint: { letter: "A", text: "BIA is analysis; DR plan is the operational playbook informed by it." } },

  { num: 141, domain: "Domain 5.3 — Vendor Due Diligence", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) Before signing with a payroll-processing vendor, the security team requests the vendor's SOC 2 Type II report, sub-processor list, and incident-response procedures. Which activity is this?",
    options: { A: "Penetration testing", B: "Vendor / third-party due diligence", C: "Supply-chain attack", D: "Threat-model brainstorming" },
    correct: "B",
    explanation: "Reviewing a vendor's controls (SOC 2, sub-processors, IR posture) prior to contracting is third-party due diligence.",
    wrongHint: { letter: "C", text: "Supply-chain attack is the threat being mitigated by due diligence; not the activity itself." } },

  { num: 142, domain: "Domain 5.3 — SLA", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "What is the PRIMARY purpose of an SLA between a customer and a service provider?",
    options: { A: "Document the vendor's tax obligations", B: "Codify measurable service performance commitments and consequences when targets are missed", C: "Replace the master services agreement", D: "Hide vendor pricing from auditors" },
    correct: "B",
    explanation: "SLAs define availability, response-time, and other measurable commitments along with remedies (credits, penalties) for breaches.",
    wrongHint: { letter: "A", text: "Tax terms typically live elsewhere in commercial contracts." } },

  { num: 143, domain: "Domain 5.1 — Data Classification", domainNum: 5, acronym: false, scenario: false, selectMulti: false,
    stem: "Which dataset would MOST appropriately be labeled 'Restricted / PHI' under typical healthcare data classification?",
    options: { A: "Aggregated, de-identified hospital occupancy stats published quarterly", B: "Marketing-team blog drafts", C: "Patient diagnoses, treatment notes, and identifiers tied to individuals", D: "Public board-of-directors bios" },
    correct: "C",
    explanation: "PHI (Protected Health Information) includes individually identifiable health data — diagnoses, treatments, etc. — under HIPAA.",
    wrongHint: { letter: "A", text: "Properly de-identified, aggregated stats are typically not PHI." } },

  { num: 144, domain: "Domain 5.2 — Risk Treatment", domainNum: 5, acronym: false, scenario: false, selectMulti: true,
    stem: "[SELECT TWO] Which actions are valid risk-treatment strategies under standard frameworks?",
    options: { A: "Mitigation (apply controls to reduce likelihood/impact)", B: "Transference (shift the financial exposure to another party, e.g., insurance)", C: "Forgetting (delete the risk register entry)", D: "Stalling (hope leadership doesn't notice)", E: "Promotion (escalate the risk to a peer org)" },
    correct: ["A", "B"],
    explanation: "The four classic treatment strategies are Mitigate, Transfer, Avoid, and Accept. 'Forget' and 'stall' are not legitimate strategies; 'promotion' isn't a recognized treatment.",
    wrongHint: { letter: "C", text: "Deleting the risk doesn't make it go away; that's not risk acceptance, it's negligence." } },

  { num: 145, domain: "Domain 5.5 — Awareness Training", domainNum: 5, acronym: false, scenario: true, selectMulti: false,
    stem: "(Scenario) After a successful phishing simulation, training is reinforced for the users who clicked, with follow-up phishing tests scheduled monthly. Which security-program element does this BEST illustrate?",
    options: { A: "Penetration testing", B: "Continuous awareness/training reinforcement loop", C: "Disaster-recovery testing", D: "Forensic readiness" },
    correct: "B",
    explanation: "Targeted reinforcement and recurring simulations are the hallmark of an effective security awareness program.",
    wrongHint: { letter: "A", text: "Pen tests target systems; this is user-behavior training." } }
];

// =============================================================================
// PBQs (Performance-Based Questions) — matching/categorization style.
//
// Each PBQ presents N items the test-taker must assign to one of M categories
// (or to a specific match). All assignments are scored together at submit:
//   - All correct on first try   -> 1.0  (full credit)
//   - All correct on second try  -> 0.5  (half credit; only when 2-attempt mode)
//   - Otherwise                  -> 0.0
//
// Schema:
//   {
//     pbqId:        unique string id
//     title:        short title shown above the matching grid
//     domain:       human-readable domain label
//     domainNum:    1..5 (for domain-weighted scoring)
//     pbq:          true  (always true for entries in PBQ_DATA)
//     prompt:       instruction text for the test-taker
//     categories:   ordered array of category labels (the "buckets")
//     items:        ordered array of { id, label, correct }
//                   where correct is one of the category labels
//     explanation:  shown after submission
//   }
//
// MCQ entries in QUIZ_DATA above are implicitly pbq: false. Code that needs to
// know whether an entry is a PBQ should use entry.pbq === true.
// =============================================================================

window.PBQ_DATA = [
  {
    pbqId: "pbq-control-categories",
    pbq: true,
    title: "PBQ — Classify Each Control",
    domain: "Domain 1.1 — Control Categories",
    domainNum: 1,
    prompt: "Drag/assign each security control to its CompTIA control CATEGORY (Managerial, Operational, Technical, Physical).",
    categories: ["Managerial", "Operational", "Technical", "Physical"],
    items: [
      { id: "c1", label: "Acceptable Use Policy",                           correct: "Managerial" },
      { id: "c2", label: "Bollard at lobby entrance",                        correct: "Physical" },
      { id: "c3", label: "Firewall ACL rule",                                correct: "Technical" },
      { id: "c4", label: "Security guard performing shift checks",           correct: "Operational" },
      { id: "c5", label: "Risk assessment procedure",                        correct: "Managerial" },
      { id: "c6", label: "Disk encryption (BitLocker)",                      correct: "Technical" },
      { id: "c7", label: "Mantrap / access vestibule",                       correct: "Physical" },
      { id: "c8", label: "Awareness-training delivery (monthly reminders)",  correct: "Operational" }
    ],
    explanation: "Managerial controls are policies/risk procedures (paper). Operational controls are people-executed day-to-day (guards, awareness delivery). Technical controls are enforced by technology (firewall, encryption). Physical controls are tangible barriers (bollards, mantraps)."
  },

  {
    pbqId: "pbq-malware-behavior",
    pbq: true,
    title: "PBQ — Match Malware to Behavior",
    domain: "Domain 2.2 — Malware Types",
    domainNum: 2,
    prompt: "Match each malware family to its DEFINING behavior.",
    categories: ["Encrypts files & demands payment", "Self-propagates across network", "Hides at kernel level", "Disguises as legitimate software", "Captures keystrokes / exfils data"],
    items: [
      { id: "m1", label: "Ransomware", correct: "Encrypts files & demands payment" },
      { id: "m2", label: "Worm",       correct: "Self-propagates across network" },
      { id: "m3", label: "Rootkit",    correct: "Hides at kernel level" },
      { id: "m4", label: "Trojan",     correct: "Disguises as legitimate software" },
      { id: "m5", label: "Spyware/Keylogger", correct: "Captures keystrokes / exfils data" }
    ],
    explanation: "Defining behaviors per CompTIA: ransomware = extortion via encryption; worms self-propagate without a host program; rootkits operate at kernel level to hide artifacts; trojans masquerade as benign apps; spyware/keyloggers harvest data."
  },

  {
    pbqId: "pbq-port-protocol",
    pbq: true,
    title: "PBQ — Match Port to Secure Protocol",
    domain: "Domain 4.1 — Secure Protocols",
    domainNum: 4,
    prompt: "Assign the standard port to the protocol that uses it.",
    categories: ["22", "443", "3389", "53", "636", "993"],
    items: [
      { id: "p1", label: "SSH (encrypted shell)",       correct: "22" },
      { id: "p2", label: "HTTPS (TLS web)",             correct: "443" },
      { id: "p3", label: "RDP (Windows remote desktop)", correct: "3389" },
      { id: "p4", label: "DNS (name resolution)",       correct: "53" },
      { id: "p5", label: "LDAPS (LDAP over TLS)",       correct: "636" },
      { id: "p6", label: "IMAPS (mail retrieval over TLS)", correct: "993" }
    ],
    explanation: "Memorize the standard ports: SSH/22, DNS/53, LDAPS/636, HTTPS/443, IMAPS/993, RDP/3389. CompTIA frequently tests secure-vs-insecure pairs (e.g., LDAP/389 vs LDAPS/636, IMAP/143 vs IMAPS/993)."
  },

  {
    pbqId: "pbq-ir-phases",
    pbq: true,
    title: "PBQ — NIST 800-61 Incident Response Phases",
    domain: "Domain 4.4 — Incident Response",
    domainNum: 4,
    prompt: "Assign each action to the incident-response phase it BEST fits (NIST SP 800-61).",
    categories: ["Preparation", "Detection & Analysis", "Containment", "Eradication", "Recovery", "Lessons Learned"],
    items: [
      { id: "ir1", label: "Author runbooks and tabletop exercise the team",     correct: "Preparation" },
      { id: "ir2", label: "SIEM correlates alerts and an analyst confirms IoCs", correct: "Detection & Analysis" },
      { id: "ir3", label: "Disconnect the affected VLAN to stop spread",          correct: "Containment" },
      { id: "ir4", label: "Wipe and reimage hosts; remove persistence mechanisms", correct: "Eradication" },
      { id: "ir5", label: "Rebuild from gold images and validate before return-to-service", correct: "Recovery" },
      { id: "ir6", label: "Hold post-incident review and update playbooks",       correct: "Lessons Learned" }
    ],
    explanation: "NIST 800-61 lifecycle: Preparation (before), Detection & Analysis (identify), Containment (limit spread), Eradication (remove threat), Recovery (return to service), Lessons Learned (improve)."
  },

  {
    pbqId: "pbq-attack-mitigation",
    pbq: true,
    title: "PBQ — Match Attack to Best Mitigation",
    domain: "Domain 2.4 — Common Attacks",
    domainNum: 2,
    prompt: "Assign each attack to the SINGLE mitigation that most directly defeats it.",
    categories: [
      "Parameterized queries / prepared statements",
      "Output encoding + CSP",
      "Anti-CSRF tokens (synchronizer pattern)",
      "Account lockout + MFA",
      "Dynamic ARP Inspection (DAI)",
      "DNSSEC validation"
    ],
    items: [
      { id: "a1", label: "SQL injection",     correct: "Parameterized queries / prepared statements" },
      { id: "a2", label: "Reflected/Stored XSS", correct: "Output encoding + CSP" },
      { id: "a3", label: "CSRF",              correct: "Anti-CSRF tokens (synchronizer pattern)" },
      { id: "a4", label: "Online password brute-force", correct: "Account lockout + MFA" },
      { id: "a5", label: "ARP poisoning (on-path)",     correct: "Dynamic ARP Inspection (DAI)" },
      { id: "a6", label: "DNS cache poisoning",          correct: "DNSSEC validation" }
    ],
    explanation: "Each attack has a textbook control: SQLi -> parameterization; XSS -> encoding/CSP; CSRF -> tokens; brute-force -> lockout+MFA; ARP poisoning -> DAI on the switch; DNS poisoning -> DNSSEC for response authenticity."
  },

  {
    pbqId: "pbq-risk-treatment",
    pbq: true,
    title: "PBQ — Risk Treatment Strategy",
    domain: "Domain 5.2 — Risk Management",
    domainNum: 5,
    prompt: "Classify each business decision as one of the four risk-treatment strategies.",
    categories: ["Avoidance", "Mitigation", "Transfer", "Acceptance"],
    items: [
      { id: "r1", label: "Buy a cyber-insurance policy that covers breach costs",       correct: "Transfer" },
      { id: "r2", label: "Discontinue the legacy product line that creates the risk",    correct: "Avoidance" },
      { id: "r3", label: "Document & sign off on a low-likelihood/low-impact residual",   correct: "Acceptance" },
      { id: "r4", label: "Deploy MFA + EDR to reduce likelihood of credential theft",     correct: "Mitigation" },
      { id: "r5", label: "Outsource payment processing to a PCI-compliant vendor",        correct: "Transfer" },
      { id: "r6", label: "Patch the vulnerable system in this Friday's maintenance window", correct: "Mitigation" }
    ],
    explanation: "Avoidance eliminates the risky activity; Mitigation reduces likelihood/impact via controls; Transfer shifts the financial burden to a third party (insurance, vendor); Acceptance is a documented choice to live with the residual risk."
  },

  {
    pbqId: "pbq-auth-factors",
    pbq: true,
    title: "PBQ — Authentication Factor Categories",
    domain: "Domain 4.6 — Identity & Access",
    domainNum: 4,
    prompt: "Match each authenticator to its factor category.",
    categories: ["Something you know", "Something you have", "Something you are", "Somewhere you are", "Something you do"],
    items: [
      { id: "f1", label: "8-character passphrase",                          correct: "Something you know" },
      { id: "f2", label: "FIDO2 hardware security key",                     correct: "Something you have" },
      { id: "f3", label: "Fingerprint scan",                                correct: "Something you are" },
      { id: "f4", label: "GPS-based geofencing check",                      correct: "Somewhere you are" },
      { id: "f5", label: "Typing-cadence (keystroke dynamics) profile",     correct: "Something you do" },
      { id: "f6", label: "PIN code memorized by user",                      correct: "Something you know" },
      { id: "f7", label: "TOTP code from an authenticator app on the phone", correct: "Something you have" }
    ],
    explanation: "CompTIA recognizes five factor families: knowledge (know), possession (have), inherence/biometric (are), location (somewhere), and behavioral (do). True MFA requires factors from DIFFERENT families."
  },

  {
    pbqId: "pbq-crypto-property",
    pbq: true,
    title: "PBQ — Cryptography Security Property",
    domain: "Domain 1.4 — Cryptography",
    domainNum: 1,
    prompt: "For each crypto primitive, assign the security property it PRIMARILY provides.",
    categories: ["Confidentiality", "Integrity", "Authentication", "Non-repudiation", "Availability"],
    items: [
      { id: "k1", label: "AES-256 in GCM mode (data-at-rest)", correct: "Confidentiality" },
      { id: "k2", label: "SHA-256 hash of a downloaded ISO",   correct: "Integrity" },
      { id: "k3", label: "HMAC-SHA256 on an API request",      correct: "Integrity" },
      { id: "k4", label: "Digital signature on a contract (private-key sign, public-key verify)", correct: "Non-repudiation" },
      { id: "k5", label: "TLS server certificate chain validation", correct: "Authentication" },
      { id: "k6", label: "Symmetric session key for an HTTPS tunnel", correct: "Confidentiality" }
    ],
    explanation: "Encryption protects confidentiality. Hashes and HMACs protect integrity (HMACs add sender authentication via a shared secret). Digital signatures provide non-repudiation. Certificate chain validation authenticates the server identity."
  },

  {
    pbqId: "pbq-cloud-shared-resp",
    pbq: true,
    title: "PBQ — Cloud Shared Responsibility (IaaS)",
    domain: "Domain 3.1 — Cloud",
    domainNum: 3,
    prompt: "In an IaaS deployment (e.g., Linux VMs on AWS EC2), assign each layer to whoever is responsible.",
    categories: ["Cloud provider", "Customer"],
    items: [
      { id: "s1", label: "Physical data-center security",        correct: "Cloud provider" },
      { id: "s2", label: "Hypervisor patching",                   correct: "Cloud provider" },
      { id: "s3", label: "Guest OS patching",                     correct: "Customer" },
      { id: "s4", label: "Application code & dependencies",       correct: "Customer" },
      { id: "s5", label: "IAM users, roles, and policies inside the account", correct: "Customer" },
      { id: "s6", label: "Underlying network fabric & power",     correct: "Cloud provider" },
      { id: "s7", label: "Customer data classification & encryption keys (BYOK)", correct: "Customer" }
    ],
    explanation: "In IaaS the provider secures everything up to the hypervisor; the customer secures the guest OS and above (OS patches, app code, IAM, data, encryption keys). Provider 'security OF the cloud,' customer 'security IN the cloud.'"
  },

  {
    pbqId: "pbq-acronyms",
    pbq: true,
    title: "PBQ — Match Acronym to Definition",
    domain: "Domain 1.4 / 4.x — Security Acronyms",
    domainNum: 4,
    prompt: "Assign each SY0-701 security acronym to its correct expansion.",
    categories: [
      "Security Information and Event Management",
      "Endpoint Detection and Response",
      "Cloud Access Security Broker",
      "Privileged Access Management",
      "Data Loss Prevention",
      "Trusted Platform Module"
    ],
    items: [
      { id: "ac1", label: "SIEM", correct: "Security Information and Event Management" },
      { id: "ac2", label: "EDR",  correct: "Endpoint Detection and Response" },
      { id: "ac3", label: "CASB", correct: "Cloud Access Security Broker" },
      { id: "ac4", label: "PAM",  correct: "Privileged Access Management" },
      { id: "ac5", label: "DLP",  correct: "Data Loss Prevention" },
      { id: "ac6", label: "TPM",  correct: "Trusted Platform Module" }
    ],
    explanation: "These are common SY0-701 acronyms. SIEM aggregates and correlates logs; EDR monitors endpoints; CASB brokers cloud-app access; PAM vaults privileged credentials; DLP prevents unauthorized data movement; TPM is a hardware root of trust."
  },

  {
    pbqId: "pbq-crypto-use-case",
    pbq: true,
    title: "PBQ — Match Crypto Primitive to Use Case",
    domain: "Domain 1.4 — Cryptography",
    domainNum: 1,
    prompt: "Assign each cryptographic primitive to its BEST-fit use case.",
    categories: [
      "Encrypt/decrypt large data with a shared key",
      "Establish a shared key between two parties without prior secret",
      "Sign a document so the signer cannot deny it",
      "Verify a downloaded file has not been altered",
      "Authenticate a TLS server's identity",
      "Strengthen passwords against offline cracking"
    ],
    items: [
      { id: "cu1", label: "AES-256-GCM (symmetric cipher)",                correct: "Encrypt/decrypt large data with a shared key" },
      { id: "cu2", label: "Diffie–Hellman / ECDHE",                         correct: "Establish a shared key between two parties without prior secret" },
      { id: "cu3", label: "RSA / ECDSA digital signature",                  correct: "Sign a document so the signer cannot deny it" },
      { id: "cu4", label: "SHA-256 hash",                                   correct: "Verify a downloaded file has not been altered" },
      { id: "cu5", label: "X.509 certificate signed by a trusted CA",       correct: "Authenticate a TLS server's identity" },
      { id: "cu6", label: "bcrypt / Argon2 (password KDF)",                 correct: "Strengthen passwords against offline cracking" }
    ],
    explanation: "Symmetric ciphers (AES) protect bulk data; (EC)DHE establishes a shared key over an untrusted channel; signatures provide non-repudiation; hashes provide integrity; certificate validation authenticates the server; password-hashing KDFs (bcrypt/Argon2) slow down offline cracking."
  },

  {
    pbqId: "pbq-attack-osi-layer",
    pbq: true,
    title: "PBQ — Map Attack to OSI Layer",
    domain: "Domain 2.4 / 3.2 — Attacks & Network Architecture",
    domainNum: 3,
    prompt: "For each attack, choose the OSI layer where the technique PRIMARILY operates.",
    categories: ["Layer 2 (Data link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
    items: [
      { id: "ol1", label: "ARP poisoning / spoofing",          correct: "Layer 2 (Data link)" },
      { id: "ol2", label: "MAC flooding of a switch CAM table", correct: "Layer 2 (Data link)" },
      { id: "ol3", label: "ICMP smurf / IP spoofing",          correct: "Layer 3 (Network)" },
      { id: "ol4", label: "TCP SYN flood",                      correct: "Layer 4 (Transport)" },
      { id: "ol5", label: "SQL injection",                      correct: "Layer 7 (Application)" },
      { id: "ol6", label: "Cross-site scripting (XSS)",         correct: "Layer 7 (Application)" }
    ],
    explanation: "ARP and MAC attacks live at L2; ICMP and IP-spoofing techniques are L3; SYN flood targets the L4 TCP handshake; SQLi and XSS abuse application-layer (L7) inputs and output rendering."
  }
];
