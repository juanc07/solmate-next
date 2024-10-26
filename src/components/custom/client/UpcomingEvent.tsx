"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { supabase } from '@/supabaseClient'; // Import Supabase client
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil'; // Import Supabase utility

const supabaseImageUtil = new SupabaseImageUtil('upcoming-event'); // Initialize with your bucket name

const UpcomingEvent: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null); // Reset error
      try {
        // Fetch list of images from Supabase storage
        const { data, error } = await supabase.storage
          .from('upcoming-event') // Ensure the bucket name is correct
          .list(); // List all files in the bucket

        if (error) {
          console.error('UpcomingEvent Error fetching images:', error);
          setError('Error fetching images from the bucket.');
          return;
        }

        console.log('UpcomingEvent Fetched files from bucket:', data); // Log fetched files

        // If no files are returned, log a message and stop
        if (!data || data.length === 0) {
          console.warn('UpcomingEvent No images found in the bucket');
          setError('No images found in the bucket.');
          setLoading(false);
          return;
        }

        // Filter out directories and only keep files with a .jpg or .png extension
        const validFiles = data.filter(
          (file) => file.name && (file.name.endsWith('.jpg') || file.name.endsWith('.png'))
        );

        if (validFiles.length === 0) {
          console.warn('UpcomingEvent No valid image files found in the bucket');
          setError('No valid image files found in the bucket.');
          setLoading(false);
          return;
        }

        // Shuffle the validFiles array to randomize
        const shuffledFiles = validFiles.sort(() => 0.5 - Math.random());

        // Select the first 10 images or fewer if less are available
        const selectedFiles = shuffledFiles.slice(0, 10);

        // Get public URLs for each selected file
        const imageUrls = selectedFiles.map((file) => supabaseImageUtil.downloadImage(file.name));

        const resolvedImageUrls = await Promise.all(imageUrls); // Resolve the URLs
        console.log('UpcomingEvent Resolved image URLs:', resolvedImageUrls); // Log the resolved URLs

        setImageFiles(resolvedImageUrls); // Set image URLs in state
      } catch (error) {
        console.error('UpcomingEvent Error loading images:', error);
        setError('Error loading images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 sm:p-8 bg-white flex justify-center items-center">
        <p className="text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 sm:p-8 bg-white flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 sm:p-8 bg-white">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-3xl font-bold text-orange-600 text-center mb-10">
        Upcoming Events
      </h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageFiles.map((image, index) => (
          <Card key={index} className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-md">
            <Image
              src={image}
              alt={`event ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out transform hover:scale-105"
              priority={index < 3} // Prioritize loading for the first few images
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvent;
