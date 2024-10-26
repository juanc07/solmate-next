import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
            {/* Top Label */}
            <h1 className="text-4xl sm:text-5xl font-bold text-purple-600 mb-8">
                About Solmate
            </h1>

            {/* Card */}
            <Card className="w-full max-w-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-semibold mb-4">
                        Empowering the Solana Ecosystem
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg leading-relaxed space-y-4">
                    <p>
                        Welcome to Solmate, your gateway to the dynamic world of the Solana blockchain. 
                        Solmate is designed to be the all-in-one platform where enthusiasts, traders, and developers gather to 
                        buy, trade, track, and stay informed about everything Solana.
                    </p>
                    <p>
                        Whether you're looking to swap tokens, buy and sell NFTs, track top wallets, or stay updated 
                        with the latest trends and meme coins, Solmate has you covered. Our goal is to provide a seamless 
                        and intuitive experience, helping you unlock the full potential of the Solana ecosystem.
                    </p>
                    <p>
                        At Solmate, we believe in building an inclusive community where everyone—from new users to seasoned 
                        crypto veterans—can thrive. With real-time analytics, news feeds, and wallet tracking tools, we make sure 
                        you are always a step ahead in the fast-paced world of Solana.
                    </p>
                    <p>
                        Thank you for choosing Solmate. Together, let’s explore, create, and shape the future of the Solana blockchain.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default About;
