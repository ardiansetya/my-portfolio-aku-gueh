"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, Code2, GraduationCap } from "lucide-react";

const trackRecords = [
  {
    year: "2022",
    title: "Started University",
    organization: "Dian Nuswantoro University",
    description: "Began undergraduate studies in Computer Science",
    icon: GraduationCap,
    type: "education",
  },
  {
    year: "2024",
    title: "Web Division Member",
    organization: "Dian Nuswantoro Computer Club",
    description:
      "Joined as a web division member, collaborating on various web development projects and workshops",
    icon: Code2,
    type: "organization",
  },
  {
    year: "2024",
    title: "BTNG - Coding Workshop Platform",
    organization: "Personal Project",
    description:
      "Developed BTNG, a website for coding workshop registration, enabling seamless event management and participant registration",
    icon: Code2,
    type: "project",
  },
  {
    year: "2024 - 2025",
    title: "Dinacom - National Competition Platform",
    organization: "Personal Project",
    description:
      "Created Dinacom, a comprehensive platform for national competition registration and dashboard management",
    icon: Code2,
    type: "project",
  },
  {
    year: "2024",
    title: "WordPress Developer Intern",
    organization: "PWM Jawa Tengah",
    description:
      "1-month internship developing MDMC (Muhammadiyah Disaster Management Center) website using WordPress",
    icon: Building2,
    type: "internship",
  },
  {
    year: "2025",
    title: "Web Developer Intern",
    organization: "Kominfo Jawa Tengah",
    description:
      "1-month internship focused on redesigning elementary school websites with a modern management dashboard",
    icon: Briefcase,
    type: "internship",
  },
];

const typeColors = {
  education: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  organization: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  project: "bg-green-500/10 text-green-400 border-green-500/20",
  internship: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const TrackRecordSection = () => {
  return (
    <section id="track-record" className="section-padding bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            Track Record
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Education &<span className="text-gradient"> Experience</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-px bg-linear-to-b from-primary/50 via-primary/30 to-transparent" />

          <div className="space-y-8">
            {trackRecords.map((record, index) => (
              <motion.div
                key={record.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 mt-1.5" />

                {/* Content */}
                <div
                  className={`ml-8 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="glass rounded-xl p-6 hover:bg-surface-hover/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[record.type as keyof typeof typeColors]}`}
                      >
                        {record.type}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {record.year}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-2">
                      <record.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {record.title}
                        </h3>
                        <p className="text-primary font-medium text-sm mb-2">
                          {record.organization}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {record.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackRecordSection;
