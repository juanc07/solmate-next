import React from 'react';
import { ITitleProps } from "@/lib/interfaces";

const Contact: React.FC<ITitleProps> = ({ title }) => {
  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-3xl font-bold text-gray-800 text-center mb-12">
        {title}
      </h1>

      {/* Main Container */}
      <div className="flex flex-col gap-12 max-w-7xl mx-auto">
        {/* Contact Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Email */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl font-semibold text-gray-800">Email Us</h2>
            <p className="text-lg text-gray-600">contact@company.com</p>
          </div>
          {/* Call */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl font-semibold text-gray-800">Call Us</h2>
            <p className="text-lg text-gray-600">+1 234 567 890</p>
          </div>
          {/* Visit */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl font-semibold text-gray-800">Visit Us</h2>
            <p className="text-lg text-gray-600">123 Business Street, City, Country</p>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg shadow-md overflow-hidden mt-8">
          {/* Google Map Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=YOUR_GOOGLE_MAPS_EMBED_URL"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
