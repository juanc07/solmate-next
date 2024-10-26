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
      setError(null);
      try {
        const { data, error } = await supabase.storage
          .from('upcoming-event')
          .list();

        if (error) {
          console.error('Error fetching images:', error);
          setError('Error fetching images from the bucket.');
          return;
        }

        if (!data || data.length === 0) {
          console.warn('No images found in the bucket');
          setError('No images found in the bucket.');
          return;
        }

        const validFiles = data.filter(
          (file) => file.name && (file.name.endsWith('.jpg') || file.name.endsWith('.png'))
        );

        if (validFiles.length === 0) {
          setError('No valid image files found.');
          return;
        }

        const shuffledFiles = validFiles.sort(() => 0.5 - Math.random());
        const selectedFiles = shuffledFiles.slice(0, 10);

        const imageUrls = selectedFiles.map((file) =>
          supabaseImageUtil.downloadImage(file.name)
        );

        const resolvedImageUrls = await Promise.all(imageUrls);
        setImageFiles(resolvedImageUrls);
      } catch (error) {
        console.error('Error loading images:', error);
        setError('Error loading images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 sm:p-8 bg-white dark:bg-gray-900 flex justify-center items-center transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 sm:p-8 bg-white dark:bg-gray-900 flex justify-center items-center transition-colors duration-300">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 sm:p-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 text-center mb-10">
        Upcoming Events
      </h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageFiles.map((image, index) => (
          <Card
            key={index}
            className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
          >
            <Image
              src={image}
              alt={`event ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out transform hover:scale-105"
              priority={index < 3}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvent;
