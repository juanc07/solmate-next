'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { shuffleArray } from '@/lib/helper';
import { supabase } from '@/lib/supabaseClient';
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil';
import Image from 'next/image';
import { ITitleProps } from '@/lib/interfaces';
import { Loader2 } from 'lucide-react';

const supabaseImageUtil = new SupabaseImageUtil('event-showcase-images');

const eventData = [
  { title: 'Corporate Gala', description: 'A night to remember with key industry leaders.' },
    { title: 'Charity Auction', description: 'Raising funds for a noble cause.' },
    { title: 'Product Launch', description: 'Unveiling the latest innovation.' },
    { title: 'Networking Event', description: 'Connecting professionals across industries.' },
    { title: 'Wedding Reception', description: 'A beautiful celebration of love and unity.' },
    { title: 'Music Festival', description: 'Live performances by top artists.' },
    { title: 'Art Exhibition', description: 'Showcasing contemporary art and creativity.' },
    { title: 'Tech Conference', description: 'Exploring the latest in technology and innovation.' },
    { title: 'Charity Run', description: 'Running for a cause to make a difference.' },
    { title: 'Book Launch', description: 'Celebrating the release of a new literary work.' },
    { title: 'Food Festival', description: 'A culinary journey with diverse flavors.' },
    { title: 'Film Premiere', description: 'Red carpet event for a highly anticipated movie.' },
    { title: 'Charity Ball', description: 'An elegant evening supporting a great cause.' },
    { title: 'Fashion Show', description: 'Showcasing the latest trends in fashion.' },
    { title: 'Community Fair', description: 'A day of fun and activities for all ages.' },
    { title: 'Sports Tournament', description: 'Competing for the championship in various sports.' },
    { title: 'Science Fair', description: 'Innovative projects by young scientists.' },
    { title: 'Corporate Training', description: 'Enhancing skills and knowledge in the workplace.' },
    { title: 'Charity Dinner', description: 'A gourmet dining experience for a cause.' },
    { title: 'Outdoor Concert', description: 'Live music under the stars.' },
    { title: 'Fundraising Gala', description: 'A night of generosity and entertainment.' },
    { title: 'Cultural Festival', description: 'Celebrating diversity with food, music, and art.' },
    { title: 'Business Summit', description: 'Discussing strategies and growth opportunities.' },
    { title: 'Startup Pitch', description: 'Innovative startups presenting to investors.' },
];

const WorkGallery: React.FC<ITitleProps> = ({ title }) => {
  const [eventDataWithImages, setEventDataWithImages] = useState<
    { title: string; description: string; imageUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.storage.from('event-showcase-images').list();
        if (error) {
          console.error('WorkGallery Error fetching images:', error);
          setError('Error fetching images from the bucket.');
          return;
        }

        const imageUrls = data
          .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
          .map(file => supabaseImageUtil.downloadImage(file.name));

        const resolvedImageUrls = await Promise.all(imageUrls);
        const shuffledImages = shuffleArray(resolvedImageUrls);

        const updatedEventData = eventData.map((event, index) => ({
          ...event,
          imageUrl: shuffledImages[index % shuffledImages.length],
        }));

        setEventDataWithImages(updatedEventData);
      } catch (error) {
        console.error('WorkGallery Error loading images:', error);
        setError('Error loading images.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <Loader2 className="animate-spin text-violet-500 w-12 h-12" />
        <p className="text-violet-600 dark:text-violet-400 ml-4">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 bg-white dark:bg-black transition-colors duration-300">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-violet-600 dark:text-violet-400 mb-8">
        {title}
      </h2>

      <div className="max-w-[1920px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {eventDataWithImages.map((event, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform"
          >
            <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80">
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Loader2 className="animate-spin text-violet-500 w-8 h-8" />
                </div>
              )}
              <Image
                src={event.imageUrl}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className={`${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-500`}
                onLoadingComplete={() => handleImageLoad(index)}
                onError={(e) => {
                  console.error(`Error loading image: ${event.imageUrl}`);
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkGallery;
