"use client";
import { FaUpload } from "react-icons/fa";

interface ImageUploadProps {
  image: File | null;
  setImage: (image: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImage, imagePreview, setImagePreview }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Blog Image *
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        {imagePreview ? (
          <div className="space-y-4">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="mx-auto h-48 w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview("");
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="pointer-events-none">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Click to upload an image</p>
            <p className="text-sm text-gray-400">PNG, JPG, JPEG (Max. 5MB)</p>
          </div>
        )}
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required
        />
      </div>
    </div>
  );
};

export default ImageUpload;
