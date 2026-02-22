"use client";

import { Button } from "./ui/button";

const navLinks = ["About", "Projects", "Contact"];

const FooterSection = () => {
  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gradient">Ardian.</span>
        </div>

        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <Button
              variant={"link"}
              key={link}
              onClick={() => scrollTo(link)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link}
            </Button>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ardian. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
