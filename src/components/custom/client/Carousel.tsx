"use client"; // Ensure this component runs on the client side

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil';
import ErrorBoundary from '@/components/custom/client/ErrorBoundary';
import Link from 'next/link';
import { Loader2 } from 'lucide-react'; // ShadCN UI loader icon

const supabaseImageUtil = new SupabaseImageUtil('event-showcase-images');

const CustomErrorFallback = () => (
  <div className="text-center text-gray-800 dark:text-white">
    <h1>Oops! An error occurred.</h1>
    <p>We apologize for the inconvenience. Please try again later.</p>
  </div>
);

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const isTransitioning = useRef(false); // Use ref to track transitions across renders

  // Fetch images from Supabase storage
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from('event-showcase-images')
          .list();

        if (error) {
          console.error('Error fetching images:', error);
          return;
        }

        const imageUrls = data
          .filter((file) => file.name && (file.name.endsWith('.jpg') || file.name.endsWith('.png')))
          .map((file) => supabaseImageUtil.downloadImage(file.name));

        const resolvedImageUrls = await Promise.all(imageUrls);
        setImageFiles(resolvedImageUrls);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle Next button click
  const handleNext = useCallback(() => {
    if (isTransitioning.current) return; // Prevent multiple clicks during transition

    isTransitioning.current = true; // Lock transition
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageFiles.length);

    setTimeout(() => {
      isTransitioning.current = false; // Unlock transition after animation completes
    }, 1000); // Match with CSS transition duration (1s)
  }, [imageFiles.length]);

  // Handle Previous button click
  const handlePrev = useCallback(() => {
    if (isTransitioning.current) return; // Prevent multiple clicks during transition

    isTransitioning.current = true; // Lock transition
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + imageFiles.length) % imageFiles.length
    );

    setTimeout(() => {
      isTransitioning.current = false; // Unlock transition after animation completes
    }, 1000); // Match with CSS transition duration (1s)
  }, [imageFiles.length]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (imageFiles.length > 0) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [imageFiles, handleNext]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 relative">
        <Loader2 className="animate-spin text-gray-500 dark:text-gray-400 w-12 h-12 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">Loading images...</p>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Link href="/ourWork">
            <Button variant="outline" className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-75">
              View our Work
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<CustomErrorFallback />}>
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* Carousel Image Slideshow */}
        {imageFiles.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={image}
              alt={`event ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={handlePrev}
          className="z-10 absolute top-1/2 transform -translate-y-1/2 left-4 sm:left-8 md:left-12 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-75"
          style={{ minWidth: '40px', minHeight: '40px' }}
        >
          &#8249;
        </Button>

        {/* Next Button */}
        <Button
          variant="outline"
          onClick={handleNext}
          className="z-10 absolute top-1/2 transform -translate-y-1/2 right-4 sm:right-8 md:right-12 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-75"
          style={{ minWidth: '40px', minHeight: '40px' }}
        >
          &#8250;
        </Button>

        {/* Centered "View Our Work" Button */}
        <div className="absolute inset-0 flex justify-center items-center">
          <Link href="/ourWork">
            <Button variant="outline" className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-75">
              View our Work
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Carousel;
