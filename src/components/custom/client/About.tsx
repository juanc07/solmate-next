import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
            {/* Top Label */}
            <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-8">
                About Us
            </h1>

            {/* Card */}
            <Card className="w-full max-w-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-semibold mb-4">
                        Univent
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg leading-relaxed space-y-4">
                    <p>
                        Welcome to Univent, where your events come to life with creativity, precision, and unparalleled attention to detail. Our team is dedicated to turning your visions into reality, whether it’s a grand wedding, a corporate gala, or an intimate gathering.
                    </p>
                    <p>
                        With years of experience in the event management industry, we pride ourselves on our ability to execute flawless events that leave lasting impressions. Our comprehensive services cover every aspect of event planning, from venue selection and décor to entertainment and logistics.
                    </p>
                    <p>
                        Our mission is to provide a seamless, stress-free experience for our clients, ensuring that every event we manage is a success. We believe that the key to a great event lies in understanding our clients' needs and exceeding their expectations.
                    </p>
                    <p>
                        Thank you for considering Univent as your event partner. We look forward to creating unforgettable experiences with you.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default About;
