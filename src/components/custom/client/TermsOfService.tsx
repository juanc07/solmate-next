import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-8 lg:px-16 transition-colors duration-300">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-violet-600 dark:text-violet-400 mb-8">
        Terms of Service
      </h1>

      {/* Terms of Service Content */}
      <div className="max-w-4xl text-lg leading-relaxed text-gray-800 dark:text-gray-200 space-y-6">
        <p>
          Welcome to <span className="font-semibold">Solmate</span>. By accessing or using our website and services, you agree to be bound by the following Terms of Service. Please read these terms carefully before using our platform.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">1. Acceptance of Terms</h2>
        <p>
          By accessing our platform, you agree to comply with these Terms of Service and any applicable laws and regulations. If you do not agree, you are not authorized to use Solmate's services.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">2. Services Provided</h2>
        <p>
          Solmate provides services within the Solana ecosystem, including token swaps, trend tracking, wallet monitoring, NFT transactions, and news updates. We reserve the right to modify or discontinue any aspect of our services at any time.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">3. User Responsibilities</h2>
        <p>
          As a user, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide accurate and complete information during registration.</li>
          <li>Use Solmate’s services in compliance with all applicable laws.</li>
          <li>Avoid using the platform for any illegal activities or unauthorized purposes.</li>
        </ul>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">4. Payments and Fees</h2>
        <p>
          Payments related to Solana-based services or NFT transactions must be made promptly. Solmate reserves the right to restrict or cancel access to services for non-payment or fraudulent activities.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">5. Cancellation and Refunds</h2>
        <p>
          Refunds are subject to the terms of each specific transaction. Please refer to the agreement or service-specific terms for cancellation and refund policies.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">6. Limitation of Liability</h2>
        <p>
          Solmate is not liable for any direct, indirect, or incidental damages resulting from your use of the platform, including but not limited to token losses, NFT devaluation, or incorrect data.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">7. Intellectual Property</h2>
        <p>
          All content on Solmate, including text, images, and branding, is the property of Solmate and may not be reproduced without permission.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">8. Privacy Policy</h2>
        <p>
          Your use of our services is governed by our Privacy Policy. By using Solmate, you consent to the collection and use of your personal information as outlined in the Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">9. Changes to the Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Changes take effect immediately upon posting. Your continued use of the platform indicates acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].
        </p>

        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
