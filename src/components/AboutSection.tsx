"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Download,
  GitBranch,
  Globe,
  Palette,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Code2 },
  { name: "Node.js", icon: Database },
  { name: "Next.js", icon: Globe },
  { name: "Tailwind CSS", icon: Palette },
  { name: "React Native", icon: Smartphone },
  { name: "PostgreSQL", icon: Database },
  { name: "Git", icon: GitBranch },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Passionate about crafting
            <span className="text-gradient"> digital experiences.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="w-32 h-32 rounded-2xl bg-secondary border border-border overflow-hidden mb-8">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-gradient">A</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg">
              Hi, I'm Ardian Setya Pradana, an undergraduate student at Dian
              Nuswantoro University with a strong passion for full-stack
              development. I focus on building modern and scalable web
              applications using TypeScript as my primary language.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I work with technologies such as Next.js, NestJS, Express, and
              PostgreSQL, and I'm always exploring new tools to improve
              performance and code quality. As a full-stack enthusiast, I enjoy
              designing clean architectures, solving real-world problems, and
              continuously sharpening my technical skills.
            </p>

            <Button variant="default" size="lg" className="mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-8">Tech Stack</h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-surface-hover transition-colors duration-300 group cursor-default"
                >
                  <skill.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
