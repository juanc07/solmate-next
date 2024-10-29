import { supabase } from '@/supabaseClient';
import { IImageService } from './../lib/interfaces/IImageService';

export class SupabaseImageUtil implements IImageService {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  /**
   * Uploads an image to Supabase storage.
   * @param filePath - The path where the image will be uploaded in the bucket.
   * @param file - The image file to be uploaded.
   * @returns - The public URL of the uploaded image or an error message.
   */
  async uploadImage(filePath: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Failed to upload image');
    }

    const { publicUrl } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath).data;

    return publicUrl || '';
  }

  /**
   * Downloads an image from Supabase storage by generating a public URL.
   * @param filePath - The path where the image is stored.
   * @returns - A public URL for accessing the image.
   */
  async downloadImage(filePath: string): Promise<string> {
    const { publicUrl } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath).data;

    if (process.env.NEXT_PUBLIC_DEBUG_ON === "true") {
      // Log the generated public URL    
      console.log(`Public URL for ${filePath}: ${publicUrl}`);
    }

    if (!publicUrl) {
      throw new Error('Failed to retrieve image');
    }

    return publicUrl;
  }

  /**
   * Deletes an image from Supabase storage.
   * @param filePath - The path where the image is stored.
   * @returns - A success message or an error message.
   */
  async deleteImage(filePath: string): Promise<string> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error.message);
      throw new Error('Failed to delete image');
    }

    return 'Image deleted successfully';
  }
}
