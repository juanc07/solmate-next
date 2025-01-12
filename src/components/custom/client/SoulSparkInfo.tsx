"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const SoulSparkInfo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full p-4 sm:p-6">
        <Card className="w-[90%] mx-auto shadow-lg rounded-lg overflow-hidden mt-[10vh]">
          <CardContent className="p-0 flex flex-col sm:flex-row">
            {/* Image */}
            <div className="w-full sm:w-1/2">
              <Image
                src="/images/agents/soulspark.webp" // Update with appropriate image path
                alt="SoulSpark Agent"
                width={1000} // Adjust based on your image's aspect ratio
                height={600} // Adjust based on your image's aspect ratio
                className="w-full h-full object-cover"                
                unoptimized
              />
            </div>
            {/* Information */}
            <div className="w-full sm:w-1/2 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-4 text-center sm:text-left">
                SoulSpark Token
              </h1>
              <div>
                {/* Use a more responsive text size and add word wrapping */}
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Contract Address (CA):</strong> Coming Soon...
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Token Name:</strong> SoulSpark
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Token Ticker:</strong> SS
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>PumpFun:</strong> Soon..
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Purpose:</strong> The first AI Agent of the Solmate platform, aimed at enhancing and expanding the capabilities of Solmate for the Solana community.
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>About Solmate:</strong> Solmate is your gateway to the Solana blockchain ecosystem, offering tools for trading, NFT management, wallet tracking, and staying updated with Solana trends. Our goal is to provide a seamless experience for all users to explore, create, and shape the future of Solana.
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Telegram:</strong> <a href="https://t.me/solmate_platform" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Join our Telegram</a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>X (Twitter):</strong> <a href="https://x.com/soul_sparkss" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Follow us on X</a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Discord:</strong> <a href="https://discord.gg/B6wKHaXyrj" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Join our Discord Channel</a>
                </p>
                <p className="text-base sm:text-lg mt-4 leading-6">
                  <strong>Why We Launched the Token:</strong> The funds we collect or earn from the launch of Agent SoulSpark on pump.fun will be used to develop the Solmate platform. Our goal is to make Solmate self-sustaining, allowing us to create more exciting tools and features that benefit the Solana community and its users.
                </p>
                {/* Add some dummy content or space to ensure scrolling */}
                <div className="h-[50vh] md:h-0"></div> {/* Forces scrolling on small screens */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoulSparkInfo;