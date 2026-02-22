"use client";

import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null, previewUrl?: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to get image source (handles storage paths, full URLs, and data URLs)
  const getImageSource = (url: string | null | undefined) => {
    if (!url) return null;
    // If it's already a full URL or data URL, use it directly
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    // Otherwise it's a storage path - this shouldn't happen as we store full URLs now
    return url;
  };

  const imageSource = getImageSource(value);

  const handleFile = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(file, reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Project Image</label>
        <span className="text-xs text-muted-foreground">
          JPG, PNG, GIF (max 5MB)
        </span>
      </div>

      {imageSource ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-secondary">
          <Image
            fill
            src={imageSource}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          {!uploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex h-40 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed",
            "transition-colors duration-200",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-secondary hover:bg-surface-hover",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {!imageSource && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Recommended: 1200x800px or 3:2 aspect ratio</span>
        </div>
      )}
    </div>
  );
}
