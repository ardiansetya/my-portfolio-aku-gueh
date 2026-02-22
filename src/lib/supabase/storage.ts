import { createClient } from "./client";

const BUCKET_NAME = "project-images";

/**
 * Upload a project image to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @param projectId - The project's ID (optional for new projects)
 * @returns The public URL of the uploaded image
 */
export async function uploadProjectImage(
  file: File,
  userId: string,
  projectId?: string
): Promise<{ url: string; path: string } | null> {
  try {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${projectId || crypto.randomUUID()}.${fileExt}`;
    const path = `${userId}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

    return { url: publicUrl, path };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

/**
 * Delete a project image from Supabase Storage
 * @param path - The storage path of the image
 */
export async function deleteProjectImage(path: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

/**
 * Get the public URL for an image
 * @param path - The storage path of the image
 */
export function getImageUrl(path: string): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return publicUrl;
}

/**
 * Extract storage path from a full URL
 */
export function getPathFromUrl(url: string): string {
  const supabase = createClient();
  const baseUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl("").data.publicUrl;
  return url.replace(baseUrl, "");
}

/**
 * Upload image and return URL string for form submission
 */
export async function handleImageUpload(
  file: File | null,
  userId: string,
  projectId?: string,
  oldImageUrl?: string | null
): Promise<string | null> {
  if (!file) return oldImageUrl ?? null;

  // Delete old image if exists (convert URL to path)
  if (oldImageUrl) {
    const oldPath = getPathFromUrl(oldImageUrl);
    await deleteProjectImage(oldPath);
  }

  // Upload new image
  const result = await uploadProjectImage(file, userId, projectId);
  return result?.url || null;
}
