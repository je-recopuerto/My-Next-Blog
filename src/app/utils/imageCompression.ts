/**
 * Compress image file to reduce size
 * @param file - Image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 2MB)
 * @param quality - Image quality (0-1, default: 0.8)
 * @returns Promise<File> - Compressed image file
 */
export async function compressImage(
  file: File, 
  maxSizeMB: number = 2, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let { width, height } = img;
      
      // Resize if too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            // Check if still too large, reduce quality further
            if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.3) {
              compressImage(file, maxSizeMB, quality - 0.1)
                .then(resolve)
                .catch(reject);
            } else {
              resolve(compressedFile);
            }
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file size and type
 * @param file - Image file to validate
 * @param maxSizeMB - Maximum allowed size in MB
 * @returns object with validation result and message
 */
export function validateImageFile(file: File, maxSizeMB: number = 10) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: 'Only JPEG, PNG, and WebP images are allowed.'
    };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      message: `Image size should be less than ${maxSizeMB}MB.`
    };
  }
  
  return {
    isValid: true,
    message: 'Image is valid.'
  };
}