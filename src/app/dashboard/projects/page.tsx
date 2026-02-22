"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ProjectsDataTable, ProjectData } from "@/components/dashboard/projects-data-table";
import { ProjectFormData } from "@/components/dashboard/project-form";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const supabase = createClient();

  async function fetchProjects() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch projects");
      return;
    }

    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleCreate(data: ProjectFormData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      tech: data.tech.split(",").map((t) => t.trim()).filter(Boolean),
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      color_from: data.color_from,
      color_to: data.color_to,
      featured: data.featured,
      image_url: data.image_url || null,
    });

    if (error) {
      toast.error("Failed to create project");
      throw error;
    }

    toast.success("Project created!");
  }

  async function handleUpdate(id: string, data: ProjectFormData) {
    const { error } = await supabase
      .from("projects")
      .update({
        title: data.title,
        description: data.description,
        category: data.category,
        tech: data.tech.split(",").map((t) => t.trim()).filter(Boolean),
        live_url: data.live_url || null,
        github_url: data.github_url || null,
        color_from: data.color_from,
        color_to: data.color_to,
        featured: data.featured,
        image_url: data.image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update project");
      throw error;
    }

    toast.success("Project updated!");
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
      throw error;
    }

    toast.success("Project deleted");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-muted-foreground">
          Manage your portfolio projects
        </p>
      </div>

      {/* Data Table */}
      <ProjectsDataTable
        data={projects}
        userId={userId}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRefresh={fetchProjects}
      />
    </div>
  );
}
