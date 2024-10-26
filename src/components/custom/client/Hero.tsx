'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient'; // Import Supabase client
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil';
import { shuffleArray } from '@/lib/helper'; // Utility to shuffle images
import { Loader2 } from 'lucide-react'; // Import the spinner

const supabaseImageUtil = new SupabaseImageUtil('event-showcase-images'); // Adjust the bucket name

interface HeroProps {
  title: string;
}

const Hero: React.FC<HeroProps> = ({ title }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Fetch images from Supabase storage bucket
        const { data, error } = await supabase.storage.from('event-showcase-images').list();

        if (error) {
          setError('Failed to load images.');
          console.error('Error fetching images:', error);
          return;
        }

        if (data && data.length > 0) {
          const imageUrls = data
            .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
            .map(file => supabaseImageUtil.downloadImage(file.name));

          const resolvedImageUrls = await Promise.all(imageUrls);
          const shuffledImages = shuffleArray(resolvedImageUrls);
          setBackgroundImage(shuffledImages[0]); // Set the first shuffled image
        } else {
          setError('No images found.');
        }
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Error loading images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200">
        <Loader2 className="animate-spin text-gray-500 w-12 h-12 mb-4" />
        <p className="text-gray-600">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section
      className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center z-10">{title}</h1>
      </div>
    </section>
  );
};

export default Hero;
