"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm, ProjectFormData } from "@/components/dashboard/project-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectFormData | null>(null);

  useEffect(() => {
    async function fetchProject() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast.error("Project not found");
        router.push("/dashboard/projects");
        return;
      }

      setProject({
        title: data.title,
        description: data.description,
        category: data.category,
        tech: data.tech.join(", "),
        live_url: data.live_url || "",
        github_url: data.github_url || "",
        color_from: data.color_from,
        color_to: data.color_to,
        featured: data.featured,
        image_url: data.image_url || null,
      });
      setLoading(false);
    }

    fetchProject();
  }, [params.id, supabase, router]);

  async function handleSubmit(data: ProjectFormData) {
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
      .eq("id", params.id);

    if (error) {
      toast.error("Failed to update project");
      return;
    }

    toast.success("Project updated!");
    router.push("/dashboard/projects");
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <p className="text-muted-foreground">
            Update your project details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Edit the information for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            submitLabel="Update Project"
            onCancel={() => router.push("/dashboard/projects")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
