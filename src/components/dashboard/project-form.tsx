"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { createClient } from "@/lib/supabase/client";
import { handleImageUpload } from "@/lib/supabase/storage";
import { useEffect, useState } from "react";

export interface ProjectFormData {
  title: string;
  description: string;
  category: "Web" | "Mobile" | "Design";
  tech: string;
  live_url?: string;
  github_url?: string;
  color_from: string;
  color_to: string;
  featured: boolean;
  image_url: string | null;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  userId?: string;
  projectId?: string;
}

const colorOptions = [
  { from: "from-primary/20", to: "to-accent/20", label: "Primary → Accent" },
  { from: "from-accent/20", to: "to-primary/20", label: "Accent → Primary" },
  { from: "from-primary/30", to: "to-primary/5", label: "Primary Gradient" },
  { from: "from-accent/30", to: "to-accent/5", label: "Accent Gradient" },
  { from: "from-primary/15", to: "to-accent/15", label: "Primary/Accent Mix" },
  { from: "from-accent/20", to: "to-primary/10", label: "Accent/Primary Mix" },
];

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Project",
  userId,
  projectId,
}: ProjectFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null);
  const supabase = createClient();

  // Get current user ID if not provided
  useEffect(() => {
    if (!userId) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setCurrentUserId(user.id);
      });
    }
  }, [userId, supabase]);

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "Web",
      tech: initialData?.tech || "",
      live_url: initialData?.live_url || "",
      github_url: initialData?.github_url || "",
      color_from: initialData?.color_from || "from-primary/20",
      color_to: initialData?.color_to || "to-accent/20",
      featured: initialData?.featured || false,
      image_url: initialData?.image_url ?? null,
    },
    onSubmit: async ({ value }) => {
      setUploading(true);
      try {
        // Upload image if a new file was selected
        let imageUrl = value.image_url;
        if (imageFile && currentUserId) {
          const uploadedUrl = await handleImageUpload(
            imageFile,
            currentUserId,
            projectId,
            initialData?.image_url
          );
          imageUrl = uploadedUrl;
        }

        await onSubmit({
          ...value,
          image_url: imageUrl,
        });
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Project title"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Project description"
                  className="min-h-[100px]"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="image_url"
          children={(field) => (
            <div>
              <ImageUpload
                value={imagePreview}
                onChange={(file, previewUrl) => {
                  setImageFile(file);
                  if (previewUrl) {
                    setImagePreview(previewUrl);
                  } else {
                    setImagePreview(null);
                    field.handleChange(null);
                  }
                }}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="category"
            children={(field) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "Web" | "Mobile" | "Design")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <form.Field
            name="featured"
            children={(field) => (
              <Field>
                <FieldLabel>Featured on Portfolio</FieldLabel>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.state.value ? "Yes" : "No"}
                  </span>
                </div>
              </Field>
            )}
          />
        </div>

        <form.Field
          name="tech"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Technologies (comma separated)
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="React, Node.js, TypeScript"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="live_url"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Live URL (optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://..."
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="github_url"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    GitHub URL (optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <form.Field
          name="color_from"
          children={(field) => (
            <Field>
              <FieldLabel>Thumbnail Color</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  const selected = colorOptions.find(
                    (opt) => opt.from === value,
                  );
                  if (selected) {
                    field.handleChange(selected.from);
                    // Also update color_to
                    const colorToField = form.getFieldInfo("color_to");
                    colorToField.instance?.handleChange(selected.to);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((opt) => (
                    <SelectItem key={opt.from} value={opt.from}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.state.isSubmitting || uploading}>
            {uploading ? "Uploading..." : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
