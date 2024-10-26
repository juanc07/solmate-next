'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Client-side navigation

const ExploreButton = () => {
  const [isMounted, setIsMounted] = useState(false);  // Track whether the component is mounted
  const router = useRouter();  // Initialize useRouter

  // Ensure this only runs after the component has mounted on the client
  useEffect(() => {
    setIsMounted(true);  // Mark the component as mounted
  }, []);

  const handleExploreClick = () => {
    if (isMounted) {
      // Navigate to the "ourWork" page or perform another action
      console.log('Explore our services button clicked');
      router.push('/ourWork');  // Navigate on click
    }
  };

  return (
    <button onClick={handleExploreClick} className="p-2 bg-blue-600 text-white hover:bg-blue-500">
      View our Work
    </button>
  );
};

export default ExploreButton;
