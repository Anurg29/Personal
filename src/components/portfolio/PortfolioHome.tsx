"use client";

import { motion } from "framer-motion";
import {
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    Code2,
    Brain,
    Server,
    Wrench,
    ChevronDown,
} from "lucide-react";

const skills = [
    {
        category: "Languages",
        icon: Code2,
        items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "SQL"],
        color: "#00d4ff",
    },
    {
        category: "Frontend",
        icon: Code2,
        items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
        color: "#6366f1",
    },
    {
        category: "Backend",
        icon: Server,
        items: ["Node.js", "FastAPI", "Django", "Express", "PostgreSQL", "MongoDB"],
        color: "#10b981",
    },
    {
        category: "AI / ML",
        icon: Brain,
        items: ["Hugging Face", "TensorFlow", "PyTorch", "LangChain", "OpenAI"],
        color: "#f59e0b",
    },
    {
        category: "DevOps & Tools",
        icon: Wrench,
        items: ["Git", "Docker", "Linux", "AWS", "GitHub Actions", "VS Code"],
        color: "#ef4444",
    },
];

const projects = [
    {
        title: "CareFlow",
        subtitle: "Hospital Queue Management System",
        description:
            "Real-time hospital queue management with patient tracking, doctor dashboards, bed management, and automated notifications via WebSocket.",
        tech: ["Django", "React", "PostgreSQL", "WebSocket", "REST API"],
        gradient: "from-cyan-500/20 to-blue-600/20",
        border: "border-cyan-500/30",
    },
    {
        title: "Personal Hub (A.R.K.)",
        subtitle: "AI-Powered Personal Dashboard",
        description:
            "Full-stack personal command center with J.A.R.V.I.S. AI assistant, GitHub portfolio, market tracking, and Google Suite integration.",
        tech: ["Next.js", "TypeScript", "FastAPI", "LangChain", "Tailwind"],
        gradient: "from-indigo-500/20 to-purple-600/20",
        border: "border-indigo-500/30",
    },
    {
        title: "PayFlow",
        subtitle: "Payment Gateway System",
        description:
            "High-throughput payment gateway with QR-based transactions, merchant dashboards, and real-time payment processing.",
        tech: ["React", "Node.js", "MongoDB", "QR Code", "REST API"],
        gradient: "from-emerald-500/20 to-teal-600/20",
        border: "border-emerald-500/30",
    },
    {
        title: "Market Intelligence",
        subtitle: "Portfolio & Market Tracker",
        description:
            "AI-powered market tracking with portfolio management, technical analysis, real-time data from Yahoo Finance, and AI insights.",
        tech: ["Python", "Yahoo Finance", "SQLite", "Recharts", "AI Analysis"],
        gradient: "from-amber-500/20 to-orange-600/20",
        border: "border-amber-500/30",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function PortfolioHome() {
    return (
        <div className="min-h-screen">
            {/* ── HERO SECTION ── */}
            <section className="flex flex-col items-center justify-center min-h-[90vh] text-center relative px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="font-mono text-[#00d4ff]/50 text-xs tracking-[0.4em] uppercase">
              // Portfolio Initialized
                        </span>
                    </motion.div>

                    {/* Name */}
                    <h1 className="font-orbitron text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wider mb-6 leading-tight">
                        <motion.span
                            className="text-[#e2e8f0] block"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            ANURAG
                        </motion.span>
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#6366f1] block"
                            style={{
                                textShadow: "none",
                                WebkitTextFillColor: "transparent",
                                WebkitBackgroundClip: "text",
                            }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            ROKADE
                        </motion.span>
                    </h1>

                    {/* Tagline */}
                    <motion.p
                        className="font-mono text-[#94a3b8] text-base sm:text-lg tracking-wide max-w-xl mx-auto mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Full-Stack Developer &middot; AI Explorer &middot; Problem Solver
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex items-center gap-4 justify-center flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <a
                            href="#projects"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-medium text-sm tracking-wider hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300"
                        >
                            View Projects
                        </a>
                        <a
                            href="#contact"
                            className="px-6 py-3 rounded-lg border border-[#00d4ff]/30 text-[#00d4ff] font-medium text-sm tracking-wider hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/50 transition-all duration-300"
                        >
                            Contact Me
                        </a>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="flex items-center gap-5 justify-center mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        {[
                            { icon: Github, href: "https://github.com/Anurag29", label: "GitHub" },
                            {
                                icon: Linkedin,
                                href: "https://linkedin.com/in/anuragrokade",
                                label: "LinkedIn",
                            },
                            {
                                icon: Mail,
                                href: "mailto:anuragrokade@gmail.com",
                                label: "Email",
                            },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg border border-[rgba(0,212,255,0.15)] flex items-center justify-center text-[#64748b] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)] transition-all duration-300"
                                title={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 flex flex-col items-center gap-2 text-[#00d4ff]/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <span className="font-mono text-[10px] tracking-widest uppercase">
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ── ABOUT SECTION ── */}
            <section id="about" className="py-20 px-4">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                        <h2 className="font-orbitron text-lg text-[#00d4ff] tracking-wider font-semibold">
                            ABOUT ME
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
                    </div>

                    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                        <div className="space-y-4">
                            <p className="text-[#94a3b8] text-base leading-relaxed">
                                I&apos;m a passionate{" "}
                                <span className="text-[#e2e8f0] font-medium">
                                    Full-Stack Developer
                                </span>{" "}
                                and{" "}
                                <span className="text-[#e2e8f0] font-medium">AI enthusiast</span>{" "}
                                who loves building intelligent digital experiences. From crafting
                                pixel-perfect frontends to designing scalable backend architectures, I
                                enjoy the full spectrum of software development.
                            </p>
                            <p className="text-[#94a3b8] text-base leading-relaxed">
                                Currently exploring the intersection of{" "}
                                <span className="text-[#00d4ff]">AI/ML</span> and{" "}
                                <span className="text-[#00d4ff]">web development</span>, building
                                tools that leverage language models, real-time data processing, and
                                modern web frameworks to create meaningful applications.
                            </p>
                            <p className="text-[#94a3b8] text-base leading-relaxed">
                                When I&apos;m not coding, you&apos;ll find me exploring new
                                technologies, contributing to open-source, or learning about
                                financial markets and AI research.
                            </p>
                        </div>

                        {/* Stats card */}
                        <div className="bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.12)] rounded-xl p-5 min-w-[200px]">
                            <div className="space-y-4">
                                {[
                                    { label: "Projects Built", value: "10+" },
                                    { label: "Technologies", value: "25+" },
                                    { label: "GitHub Repos", value: "15+" },
                                    { label: "Open Source", value: "Active" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="font-orbitron text-xl text-[#00d4ff] font-bold">
                                            {stat.value}
                                        </div>
                                        <div className="font-mono text-[10px] text-[#64748b] tracking-wider uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── SKILLS SECTION ── */}
            <section id="skills" className="py-20 px-4">
                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                        <h2 className="font-orbitron text-lg text-[#00d4ff] tracking-wider font-semibold">
                            TECH STACK
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
                    </div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {skills.map((skill) => (
                            <motion.div
                                key={skill.category}
                                variants={item}
                                className="group bg-[rgba(0,212,255,0.02)] border border-[rgba(0,212,255,0.1)] rounded-xl p-5 hover:border-[rgba(0,212,255,0.25)] hover:bg-[rgba(0,212,255,0.04)] transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${skill.color}15` }}
                                    >
                                        <skill.icon
                                            className="w-4 h-4"
                                            style={{ color: skill.color }}
                                        />
                                    </div>
                                    <h3
                                        className="font-orbitron text-sm font-semibold tracking-wider"
                                        style={{ color: skill.color }}
                                    >
                                        {skill.category}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skill.items.map((s) => (
                                        <span
                                            key={s}
                                            className="px-2.5 py-1 rounded-md text-xs font-mono text-[#94a3b8] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:text-[#e2e8f0] hover:border-[rgba(0,212,255,0.2)] transition-all"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── PROJECTS SECTION ── */}
            <section id="projects" className="py-20 px-4">
                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                        <h2 className="font-orbitron text-lg text-[#00d4ff] tracking-wider font-semibold">
                            PROJECTS
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.title}
                                variants={item}
                                className={`group relative rounded-xl border ${project.border} overflow-hidden hover:shadow-[0_0_30px_rgba(0,212,255,0.08)] transition-all duration-500`}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-orbitron text-base font-semibold text-[#e2e8f0] tracking-wide group-hover:text-[#00d4ff] transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="font-mono text-[10px] text-[#64748b] tracking-wider uppercase mt-0.5">
                                                {project.subtitle}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-[#64748b] group-hover:text-[#00d4ff] transition-colors flex-shrink-0 mt-1" />
                                    </div>
                                    <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-2 py-0.5 text-[10px] font-mono text-[#00d4ff]/70 border border-[#00d4ff]/15 rounded-md"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── EDUCATION SECTION ── */}
            <section id="education" className="py-20 px-4">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                        <h2 className="font-orbitron text-lg text-[#00d4ff] tracking-wider font-semibold">
                            EDUCATION
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
                    </div>

                    <div className="bg-[rgba(0,212,255,0.02)] border border-[rgba(0,212,255,0.1)] rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#6366f1]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="font-orbitron text-sm font-bold text-[#00d4ff]">
                                    BE
                                </span>
                            </div>
                            <div>
                                <h3 className="font-orbitron text-base font-semibold text-[#e2e8f0] tracking-wide">
                                    Bachelor of Engineering
                                </h3>
                                <p className="text-[#00d4ff] text-sm font-medium mt-0.5">
                                    Computer Science & Engineering
                                </p>
                                <p className="text-[#64748b] text-xs font-mono mt-1">
                                    2020 — 2024
                                </p>
                                <p className="text-[#94a3b8] text-sm leading-relaxed mt-3">
                                    Focused on software engineering, data structures, algorithms,
                                    artificial intelligence, and machine learning. Built multiple
                                    real-world projects and participated in hackathons.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── CONTACT SECTION ── */}
            <section id="contact" className="py-20 px-4 mb-20">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/30 to-transparent" />
                        <h2 className="font-orbitron text-lg text-[#00d4ff] tracking-wider font-semibold">
                            GET IN TOUCH
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/30 to-transparent" />
                    </div>

                    <p className="text-[#94a3b8] text-base max-w-lg mx-auto mb-8 leading-relaxed">
                        I&apos;m always open to new opportunities, collaborations, and
                        interesting conversations. Feel free to reach out!
                    </p>

                    <div className="flex items-center gap-4 justify-center flex-wrap">
                        <a
                            href="mailto:anuragrokade@gmail.com"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-medium text-sm tracking-wider hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300"
                        >
                            <Mail className="w-4 h-4" />
                            Say Hello
                        </a>
                        <a
                            href="https://github.com/Anurag29"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#00d4ff]/30 text-[#00d4ff] font-medium text-sm tracking-wider hover:bg-[#00d4ff]/10 transition-all duration-300"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com/in/anuragrokade"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#6366f1]/30 text-[#6366f1] font-medium text-sm tracking-wider hover:bg-[#6366f1]/10 transition-all duration-300"
                        >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </a>
                    </div>


                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-[rgba(0,212,255,0.1)] py-8 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <span className="font-mono text-xs text-[#64748b]">
                        © {new Date().getFullYear()} Anurag Rokade
                    </span>
                    <span className="font-mono text-[10px] text-[#64748b]/50 tracking-wider">
                        Built with Next.js + TypeScript
                    </span>
                </div>
            </footer>
        </div>
    );
}
