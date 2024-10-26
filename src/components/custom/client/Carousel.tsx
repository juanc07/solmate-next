'use client';  // Ensure this component runs on the client side

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';  // Adjust the path based on your project
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil';  // Adjust the path based on your project
import ErrorBoundary from '@/components/custom/client/ErrorBoundary';
import Link from 'next/link';  // Import Link for client-side navigation
import { Loader2 } from 'lucide-react';  // ShadCN UI loader icon

const supabaseImageUtil = new SupabaseImageUtil('event-showcase-images');  // Initialize with your bucket name

const CustomErrorFallback = () => (
  <div className="text-center">
    <h1>Oops! An error occurred.</h1>
    <p>We apologize for the inconvenience. Please try again later.</p>
  </div>
);

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from Supabase Storage
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from('event-showcase-images')
          .list();  // List all files in the bucket

        if (error) {
          console.error('Error fetching images:', error);
          return;
        }

        const imageUrls = data
          .filter(file => file.name && (file.name.endsWith('.jpg') || file.name.endsWith('.png')))  // Filter file types
          .map(file => supabaseImageUtil.downloadImage(file.name));  // Get public URLs for each file

        const resolvedImageUrls = await Promise.all(imageUrls);  // Resolve the URLs
        setImageFiles(resolvedImageUrls);  // Set image URLs in state
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Memoize handleNext to avoid re-creation on each render
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageFiles.length);
  }, [imageFiles.length]);

  // Memoize handlePrev to avoid re-creation on each render
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageFiles.length) % imageFiles.length);
  }, [imageFiles.length]);

  // Set interval to auto-slide images every 3 seconds
  useEffect(() => {
    if (imageFiles.length > 0) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000);

      return () => clearInterval(interval);  // Cleanup the interval on component unmount
    }
  }, [imageFiles, handleNext]);

  if (loading) {
    // Centered loading spinner with "View our Work" button
    return (
      <div className="flex flex-col justify-center items-center h-96 relative">
        <Loader2 className="animate-spin text-gray-500 w-12 h-12 mb-4" />
        <p className="text-gray-600 mb-4">Loading images...</p>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Link href="/ourWork">
            <Button variant="outline" className="bg-white bg-opacity-50">
              View our Work
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Carousel UI after images load
  return (
    <ErrorBoundary fallback={<CustomErrorFallback />}>
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {/* Carousel Image Slideshow */}
        {imageFiles.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`event ${index + 1}`}
              layout="fill"  // Fill the container
              objectFit="cover"  // Ensure the image covers the container
              priority={index === 0}  // Load the first image as priority
            />
          </div>
        ))}

        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={handlePrev}
          className="absolute top-1/2 transform -translate-y-1/2 left-4 sm:left-8 md:left-12 bg-white bg-opacity-50"
        >
          &#8249;
        </Button>

        {/* Next Button */}
        <Button
          variant="outline"
          onClick={handleNext}
          className="absolute top-1/2 transform -translate-y-1/2 right-4 sm:right-8 md:right-12 bg-white bg-opacity-50"
        >
          &#8250;
        </Button>

        {/* Centered "View Our Work" button */}
        <div className="absolute inset-0 flex justify-center items-center">
          <Link href="/ourWork">
            <Button variant="outline" className="bg-white bg-opacity-50">
              View our Work
            </Button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Carousel;
