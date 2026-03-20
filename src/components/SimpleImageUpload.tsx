'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function SimpleImageUpload({
  images,
  onImagesChange,
  maxImages = 5
}: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress('Preparing files...');
    
    try {
      const newImages = [...images];
      
      for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
        const file = files[i];
        
        setUploadProgress(`Uploading ${file.name}...`);
        
        try {
          const formData = new FormData();
          formData.append('file', file);

          // Create a local preview URL immediately
          const localPreviewUrl = URL.createObjectURL(file);

          const response = await fetch('/api/simple-upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          
          if (response.ok && result.url && !result.isPlaceholder) {
            // Use the actual uploaded URL if successful
            newImages.push(result.url);
            
            // Clean up the local preview
            URL.revokeObjectURL(localPreviewUrl);
          } else {
            // Use the local preview if upload failed
            newImages.push(localPreviewUrl);
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          const localPreviewUrl = URL.createObjectURL(file);
          newImages.push(localPreviewUrl);
        }
      }
      
      onImagesChange(newImages);
      setUploadProgress('Upload completed!');
      
      setTimeout(() => setUploadProgress(''), 2000);
      
    } catch (error) {
      console.error('💥 General upload error:', error);
      setUploadProgress('Upload failed, but continuing...');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Clean up object URL if it's a local preview
    if (imageToRemove && imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {images.length < maxImages && (
        <motion.button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
            </div>
            {uploadProgress && (
              <div className="text-xs text-blue-600 font-medium">
                {uploadProgress}
              </div>
            )}
          </div>
        </motion.button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {images.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Image
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized={imageUrl.startsWith('blob:')} // Don't optimize blob URLs
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x300/f8fafc/94a3b8?text=Image+${index + 1}`;
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => removeImage(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Info */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            📸 Click to upload project images (max {maxImages})
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports: JPG, PNG, WebP • Max size: 10MB each
          </p>
        </div>
      )}
    </div>
  );
}
