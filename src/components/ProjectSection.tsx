"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const categories = ["All", "Web", "Mobile", "Design"];

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A modern online store with real-time inventory, Stripe payments, and admin dashboard.",
    category: "Web",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-primary/20 to-accent/20",
  },
  {
    id: 2,
    title: "Fitness Tracker App",
    description:
      "Cross-platform mobile app for tracking workouts, nutrition, and health metrics.",
    category: "Mobile",
    tech: ["React Native", "Firebase", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-accent/20 to-primary/20",
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    description:
      "Analytics dashboard with real-time data visualization and team collaboration features.",
    category: "Web",
    tech: ["Next.js", "Tailwind", "D3.js", "Supabase"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-primary/30 to-primary/5",
  },
  {
    id: 4,
    title: "Brand Identity System",
    description:
      "Complete brand identity including logo, typography, color system, and design tokens.",
    category: "Design",
    tech: ["Figma", "Illustrator", "Design Tokens"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-accent/30 to-accent/5",
  },
  {
    id: 5,
    title: "Task Management App",
    description:
      "Kanban-style project management tool with real-time updates and team features.",
    category: "Web",
    tech: ["React", "TypeScript", "WebSocket", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-primary/15 to-accent/15",
  },
  {
    id: 6,
    title: "Social Media App",
    description:
      "A feature-rich social platform with stories, messaging, and content discovery.",
    category: "Mobile",
    tech: ["React Native", "GraphQL", "AWS"],
    liveUrl: "#",
    githubUrl: "#",
    color: "from-accent/20 to-primary/10",
  },
];

const ProjectsSection = () => {
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="section-padding bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Selected <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 mb-12 flex-wrap"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                {/* Thumbnail */}
                <div
                  className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-black text-foreground/10">
                      {project.title[0]}
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.liveUrl}
                      className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <a
                      href={project.githubUrl}
                      className="p-3 rounded-full bg-secondary text-foreground hover:scale-110 transition-transform"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
