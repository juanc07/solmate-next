"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const SoulSparkInfo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="w-full p-4 sm:p-6">
        <Card className="w-full max-w-7xl mx-auto shadow-lg rounded-lg overflow-hidden mt-10">
          <CardContent className="p-0 flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative w-full lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto">
              <Image
                src="/images/agents/soulspark.webp" // Update with the appropriate image path
                alt="SoulSpark Agent"
                layout="fill"
                objectFit="contain" // Ensure the entire image is visible without being cut
                className="rounded-t-lg lg:rounded-none lg:rounded-l-lg"
                unoptimized
              />
            </div>
            {/* Information Section */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-4 text-center lg:text-left">
                SoulSpark Token
              </h1>
              <div>
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
                  <strong>PumpFun:</strong> Soon...
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Purpose:</strong> The first AI Agent of the Solmate
                  platform, aimed at enhancing and expanding the capabilities of
                  Solmate for the Solana community.
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>About Solmate:</strong> Solmate is your gateway to the
                  Solana blockchain ecosystem, offering tools for trading, NFT
                  management, wallet tracking, and staying updated with Solana
                  trends. Our goal is to provide a seamless experience for all
                  users to explore, create, and shape the future of Solana.
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Telegram:</strong>{" "}
                  <a
                    href="https://t.me/solmate_platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Join our Telegram
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>X (Twitter):</strong>{" "}
                  <a
                    href="https://x.com/soul_sparkss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Follow us on X
                  </a>
                </p>
                <p className="text-base sm:text-lg mb-2 leading-6">
                  <strong>Discord:</strong>{" "}
                  <a
                    href="https://discord.gg/B6wKHaXyrj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Join our Discord Channel
                  </a>
                </p>
                <p className="text-base sm:text-lg mt-4 leading-6">
                  <strong>Why We Launched the Token:</strong> The funds we
                  collect or earn from the launch of Agent SoulSpark on
                  pump.fun will be used to develop the Solmate platform. Our
                  goal is to make Solmate self-sustaining, allowing us to create
                  more exciting tools and features that benefit the Solana
                  community and its users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoulSparkInfo;
