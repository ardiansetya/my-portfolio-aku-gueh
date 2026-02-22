"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FolderKanban, Eye, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectStats {
  totalProjects: number;
  webProjects: number;
  mobileProjects: number;
  designProjects: number;
  featuredProjects: number;
}

interface RecentProject {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    webProjects: 0,
    mobileProjects: 0,
    designProjects: 0,
    featuredProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all user projects
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projects) {
        setStats({
          totalProjects: projects.length,
          webProjects: projects.filter((p) => p.category === "Web").length,
          mobileProjects: projects.filter((p) => p.category === "Mobile").length,
          designProjects: projects.filter((p) => p.category === "Design").length,
          featuredProjects: projects.filter((p) => p.featured).length,
        });

        setRecentProjects(
          projects.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            featured: p.featured,
            created_at: p.created_at,
          }))
        );
      }

      setLoading(false);
    }

    fetchStats();
  }, [supabase]);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      description: "All your projects",
    },
    {
      title: "Web Projects",
      value: stats.webProjects,
      icon: Eye,
      description: "Web applications",
    },
    {
      title: "Mobile Projects",
      value: stats.mobileProjects,
      icon: TrendingUp,
      description: "Mobile apps",
    },
    {
      title: "Featured",
      value: stats.featuredProjects,
      icon: Star,
      description: "Shown on portfolio",
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary">
              <div className="text-2xl font-bold">{stats.webProjects}</div>
              <div className="text-sm text-muted-foreground">Web</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <div className="text-2xl font-bold">{stats.mobileProjects}</div>
              <div className="text-sm text-muted-foreground">Mobile</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary">
              <div className="text-2xl font-bold">{stats.designProjects}</div>
              <div className="text-sm text-muted-foreground">Design</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet. Create your first project!</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/projects/new">Create Project</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
