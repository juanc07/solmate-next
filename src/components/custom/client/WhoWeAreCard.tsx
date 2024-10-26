import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const WhoWeAreCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Label */}
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-8">
        Who We Are
      </h1>

      {/* Card */}
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-semibold mb-2">
            Univent
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base sm:text-lg leading-relaxed space-y-4">
          <p>
            A Philippine-based event management service provider that delivers unique
            and memorable events. We are committed to providing highly quality services
            that make every occasion extraordinary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhoWeAreCard;
