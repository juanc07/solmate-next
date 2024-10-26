export interface IImageService {
    /**
     * Uploads an image to the storage service.
     * @param filePath - The path where the image will be uploaded.
     * @param file - The image file to be uploaded.
     * @returns - The public URL of the uploaded image or an error message.
     */
    uploadImage(filePath: string, file: File): Promise<string>;
  
    /**
     * Downloads an image from the storage service.
     * @param filePath - The path where the image is stored.
     * @returns - A public URL for accessing the image.
     */
    downloadImage(filePath: string): Promise<string>;
  
    /**
     * Deletes an image from the storage service.
     * @param filePath - The path where the image is stored.
     * @returns - A success message or an error message.
     */
    deleteImage(filePath: string): Promise<string>;
  }