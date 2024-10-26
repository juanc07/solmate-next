import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-8 lg:px-16 transition-colors duration-300">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-violet-600 dark:text-violet-400 mb-8">
        Privacy Policy
      </h1>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl text-lg leading-relaxed text-gray-800 dark:text-gray-200 space-y-6">
        <p>
          At <span className="font-semibold">Solmate</span>, we are committed to protecting the privacy of our users and visitors. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our platform and services related to the Solana ecosystem.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">1. Information We Collect</h2>
        <p>
          We may collect personal information that you voluntarily provide to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Creating an account on Solmate.</li>
          <li>Contacting us through support channels.</li>
          <li>Participating in community activities, including token swaps or NFT transactions.</li>
          <li>Subscribing to newsletters or Solana-related updates.</li>
        </ul>
        <p>This information may include your name, email address, wallet address, and other relevant data.</p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">2. How We Use Your Information</h2>
        <p>
          We use the information collected for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>To manage your account and provide personalized services.</li>
          <li>To facilitate token swaps, NFT purchases, and other Solana-based transactions.</li>
          <li>To notify you about important updates and trends in the Solana ecosystem.</li>
          <li>To improve our platform based on your feedback and usage patterns.</li>
        </ul>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">3. Sharing Your Information</h2>
        <p>
          We do not sell or rent your personal information to third parties. However, we may share your information with trusted service providers or blockchain networks for the purpose of delivering our services, such as processing Solana transactions or verifying wallet addresses.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">4. Data Security</h2>
        <p>
          We take reasonable steps to protect your personal information from unauthorized access, disclosure, or misuse. However, as blockchain-based transactions are public by design, some information may be accessible on-chain.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">5. Cookies and Tracking Technologies</h2>
        <p>
          We may use cookies or other tracking technologies to improve your browsing experience. You can adjust your browser settings to disable cookies, but some features of the platform may not function properly if you do so.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. Additionally, you can opt out of receiving marketing emails by following the unsubscribe instructions or contacting us directly.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our services or legal requirements. Please review this page regularly to stay informed about how we handle your data.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p>
          <span className="font-semibold">Solmate</span><br />
          Email: <a href="mailto:support@solmate.com" className="text-violet-600 dark:text-violet-400 underline">support@solmate.com</a><br />
          Phone: (123) 456-7890
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
