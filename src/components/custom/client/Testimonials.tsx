"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { shuffleArray } from '@/lib/helper';  // Ensure the helper is correctly implemented
import { supabase } from '@/supabaseClient';  // Import Supabase client
import { SupabaseImageUtil } from '@/lib/SupabaseImageUtil';  // Import Supabase utility
import Image from "next/image";
import { ITitleProps } from "@/lib/interfaces";

const supabaseImageUtil = new SupabaseImageUtil('testimonial-profile');  // Initialize with the correct bucket name
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239CA3AF%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 class=%27feather feather-user%27%3E%3Cpath d=%27M20.8 21.8v-.8a8 8 0 0 0-8-8h-1.6a8 8 0 0 0-8 8v.8%27/%3E%3Ccircle cx=%2712%27 cy=%277%27 r=%274%27/%3E%3C/svg%3E';

// Testimonials data
const testimonials = [
    { id: 1, name: 'John Doe', role: 'CEO, Acme Corp', feedback: 'Working with this team was a fantastic experience. Highly recommend!', imageUrl: '' },
    { id: 2, name: 'Jane Smith', role: 'Marketing Manager, Widget Co', feedback: 'Their attention to detail and creativity is unmatched.', imageUrl: '' },
    { id: 3, name: 'Michael Johnson', role: 'CTO, Tech Innovations', feedback: 'Delivered more than expected! Truly professional and efficient.', imageUrl: '' },
    { id: 4, name: 'Emily Davis', role: 'HR Director, People First', feedback: 'A seamless experience from start to finish. Exceptional work!', imageUrl: '' },
    { id: 5, name: 'David Brown', role: 'Product Manager, Big Ideas', feedback: 'The team was responsive and delivered exactly what we needed.', imageUrl: '' },
    { id: 6, name: 'Sarah Wilson', role: 'Creative Director, Visionary Designs', feedback: 'Creative and detail-oriented. Our project turned out beautifully.', imageUrl: '' },
    { id: 7, name: 'James Lee', role: 'Operations Manager, Efficiency Experts', feedback: 'Professional, efficient, and a pleasure to work with.', imageUrl: '' },
    { id: 8, name: 'Patricia Garcia', role: 'CFO, Financial Wizards', feedback: 'Their expertise is evident in every aspect of their work.', imageUrl: '' },
    { id: 9, name: 'Robert Martinez', role: 'Lead Developer, Code Masters', feedback: 'Highly skilled and knowledgeable. Exceeded our expectations.', imageUrl: '' },
    { id: 10, name: 'Linda Rodriguez', role: 'Sales Director, Global Reach', feedback: 'The final product was better than we could have imagined.', imageUrl: '' },
    { id: 11, name: 'Charles Anderson', role: 'Customer Success Manager, Happy Clients', feedback: 'Timely delivery and superb quality. We are extremely satisfied.', imageUrl: '' },
    { id: 12, name: 'Barbara Thomas', role: 'UX Designer, User Friendly', feedback: 'Fantastic results and great communication throughout the project.', imageUrl: '' },
    { id: 13, name: 'Steven Jackson', role: 'Project Manager, Get It Done', feedback: 'A truly professional team that went above and beyond for us.', imageUrl: '' },
    { id: 14, name: 'Susan White', role: 'Art Director, Creative Minds', feedback: 'Their innovative approach brought our vision to life.', imageUrl: '' },
    { id: 15, name: 'Joseph Harris', role: 'Engineer, Precision Builders', feedback: 'The attention to detail and craftsmanship is outstanding.', imageUrl: '' },
    { id: 16, name: 'Margaret Clark', role: 'VP of Marketing, Market Leaders', feedback: 'We are thrilled with the results. They delivered on every promise.', imageUrl: '' },
    { id: 17, name: 'Daniel Lewis', role: 'Consultant, Strategy Gurus', feedback: 'Top-notch service from a dedicated and talented team.', imageUrl: '' },
    { id: 18, name: 'Jessica Young', role: 'Account Manager, Client Focus', feedback: 'A wonderful experience working with such a professional group.', imageUrl: '' },
    { id: 19, name: 'Christopher Allen', role: 'Lead Designer, Elegant Solutions', feedback: 'Their creativity and execution are unparalleled.', imageUrl: '' },
    { id: 20, name: 'Nancy King', role: 'Operations Director, Smooth Sailing', feedback: 'Every detail was handled with care and precision.', imageUrl: '' },
    { id: 21, name: 'Matthew Wright', role: 'Tech Lead, Innovative Systems', feedback: 'Efficient, creative, and highly professional service.', imageUrl: '' },
    { id: 22, name: 'Betty Scott', role: 'Community Manager, Engaged Networks', feedback: 'An exceptional team that delivers exceptional results.', imageUrl: '' },
    { id: 23, name: 'Anthony Adams', role: 'Chief Strategist, Future Thinkers', feedback: 'From concept to completion, they were fantastic to work with.', imageUrl: '' },
    { id: 24, name: 'Dorothy Nelson', role: 'Director of Partnerships, Global Connections', feedback: 'Their work exceeded our expectations in every way.', imageUrl: '' },
    { id: 25, name: 'Mark Carter', role: 'Head of Design, Artistic Visions', feedback: 'A creative team that brought fresh ideas to our project.', imageUrl: '' },
    { id: 26, name: 'Lisa Mitchell', role: 'VP of Sales, Sales Leaders', feedback: 'They delivered exactly what we were looking for, and more.', imageUrl: '' },
    { id: 27, name: 'Paul Perez', role: 'Director of Engineering, Build Better', feedback: 'A truly collaborative and innovative group of professionals.', imageUrl: '' },
    { id: 28, name: 'Sandra Roberts', role: 'Founder, Creative Solutions', feedback: 'The team brought our vision to life in a way we never expected.', imageUrl: '' },
    { id: 29, name: 'George Turner', role: 'CEO, Visionary Leaders', feedback: 'Professional, creative, and an absolute pleasure to work with.', imageUrl: '' },
];

// Helper function to shuffle and pick random testimonials
const getRandomTestimonials = (count: number) => {
    const shuffled = shuffleArray([...testimonials]);
    return shuffled.slice(0, count);
};

const Testimonials: React.FC<ITitleProps> = ({ title }) => {
    const [imageFiles, setImageFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const randomTestimonials = getRandomTestimonials(6);  // Select random 6 testimonials

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase.storage
                    .from('testimonial-profile')  // Ensure bucket name is correct
                    .list();  // List files

                if (error) {
                    setError('Error fetching images from Supabase.');
                    console.error('Supabase error:', error);
                    return;
                }

                const imageUrls = data
                    .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
                    .map(file => supabaseImageUtil.downloadImage(file.name));

                const resolvedImageUrls = await Promise.all(imageUrls);
                setImageFiles(resolvedImageUrls);
            } catch (err) {
                setError('Error loading images.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    // Memoize shuffled images
    const selectedImages = useMemo(() => shuffleArray(imageFiles).slice(0, 10), [imageFiles]);

    // Helper to get a random image or use placeholder
    const getRandomImage = () => (selectedImages.length > 0 ? selectedImages[Math.floor(Math.random() * selectedImages.length)] : placeholderImage);

    if (loading) return <div>Loading testimonials...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Title at the top center */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">{title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {randomTestimonials.map(testimonial => {
                    const imageUrl = testimonial.imageUrl || getRandomImage();  // Use provided imageUrl or random

                    return (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                        >
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={imageUrl}
                                    onError={(e) => (e.currentTarget.src = placeholderImage)}  // Fallback on error
                                    alt={testimonial.name}
                                    width={120}
                                    height={40}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-300"
                                />
                                <div className="text-left">
                                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 italic">"{testimonial.feedback}"</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default Testimonials;
