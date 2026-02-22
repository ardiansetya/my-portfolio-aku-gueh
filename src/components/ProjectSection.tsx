"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/supabase/storage";
import { Button } from "./ui/button";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  live_url: string | null;
  github_url: string | null;
  color_from: string;
  color_to: string;
  featured: boolean;
  image_url: string | null;
}

const categories = ["All", "Web", "Mobile", "Design"];

export default function ProjectsSection() {
  const [active, setActive] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      // Fetch featured projects for public view
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    }

    fetchProjects();
  }, [supabase]);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  if (loading) {
    return (
      <section id="projects" className="section-padding bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-pulse text-muted-foreground">
              Loading projects...
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No projects found in this category.</p>
          </div>
        ) : (
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
                  <div className="h-48 relative overflow-hidden">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        fill
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${project.color_from} ${project.color_to} relative`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl font-black text-foreground/10">
                            {project.title[0]}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-secondary text-foreground hover:scale-110 transition-transform"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
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
        )}
      </div>
    </section>
  );
}
