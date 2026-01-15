import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'cv-images';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user's ID (for organizing files)
 * @param folder - The folder within the bucket (e.g., 'photos', 'logos')
 * @returns The public URL of the uploaded image, or null if failed
 */
export async function uploadImage(
    file: File,
    userId: string,
    folder: string = 'photos'
): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured, using local storage');
        return null;
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteImage(url: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
        return false;
    }

    try {
        // Extract file path from URL
        const urlParts = url.split(`${BUCKET_NAME}/`);
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

/**
 * Convert a File to base64 data URL (fallback for local storage)
 */
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Check if a URL is a Supabase storage URL
 */
export function isSupabaseUrl(url: string): boolean {
    return url.includes('supabase.co/storage');
}
