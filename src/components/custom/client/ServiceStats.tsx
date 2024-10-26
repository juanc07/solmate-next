// components/ServiceStats.tsx

"use client"; // Designates this as a Client Component

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ServiceStats: React.FC = () => {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center text-center bg-orange-100">
      {/* Top Label */}
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-8">
        At a Glance
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-6 sm:gap-4 md:gap-8 px-4">
        {/* First Card */}
        <Card className="w-full sm:w-1/3 h-40">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">20+</h2>
            <p className="text-lg text-center">Years of Experience</p>
          </CardContent>
        </Card>

        {/* Second Card */}
        <Card className="w-full sm:w-1/3 h-40">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">55</h2>
            <p className="text-lg text-center">Events Managed Annually</p>
          </CardContent>
        </Card>

        {/* Third Card */}
        <Card className="w-full sm:w-1/3 h-40">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">50+</h2>
            <p className="text-lg text-center">Clients and Brands Served Every Year</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceStats;
