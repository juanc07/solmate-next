import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-8">
        Terms of Service
      </h1>

      {/* Terms of Service Content */}
      <div className="max-w-4xl text-lg leading-relaxed text-gray-800 space-y-6">
        <p>
          Welcome to <span className="font-semibold">Univent - Event Management Services</span>. By accessing or using our website and services, you agree to be bound by the following Terms of Service. Please read these terms carefully before using our services.
        </p>

        <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
        <p>
          By accessing our website or using our services, you agree to comply with and be bound by these Terms of Service and any applicable laws and regulations. If you do not agree to these terms, you are not authorized to use our services.
        </p>

        <h2 className="text-2xl font-bold">2. Services Provided</h2>
        <p>
          Univent provides event management services including, but not limited to, event planning, coordination, and execution. We reserve the right to modify or discontinue any aspect of our services at any time without prior notice.
        </p>

        <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
        <p>
          As a user of our services, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide accurate and complete information when requesting services or registering for events.</li>
          <li>Not use our services for any illegal or unauthorized purpose.</li>
          <li>Comply with all applicable laws and regulations when using our services.</li>
        </ul>

        <h2 className="text-2xl font-bold">4. Payments and Fees</h2>
        <p>
          All payments for services must be made in accordance with the terms agreed upon during the booking process. Univent reserves the right to refuse or cancel services if payments are not received in a timely manner.
        </p>

        <h2 className="text-2xl font-bold">5. Cancellation and Refunds</h2>
        <p>
          Cancellation of services must be made in writing. Refunds will be provided based on the terms outlined in the specific service agreement. Please refer to your contract for detailed cancellation and refund policies.
        </p>

        <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
        <p>
          Univent is not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services, including any loss of data or profit. We make no warranties or guarantees regarding the accuracy or reliability of our services.
        </p>

        <h2 className="text-2xl font-bold">7. Intellectual Property</h2>
        <p>
          All content provided on our website, including text, images, logos, and branding, is the intellectual property of Univent and may not be used, reproduced, or distributed without prior written permission.
        </p>

        <h2 className="text-2xl font-bold">8. Privacy Policy</h2>
        <p>
          Your use of our services is also governed by our Privacy Policy, which details how we collect, use, and protect your personal information. By using our services, you consent to the practices outlined in our Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold">9. Changes to the Terms</h2>
        <p>
          We reserve the right to update or modify these Terms of Service at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services constitutes your acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-bold">10. Governing Law</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from or related to the use of our services will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
        </p>

        <h2 className="text-2xl font-bold">11. Contact Information</h2>
        <p>
          If you have any questions or concerns about these Terms of Service, please contact us at:
        </p>
        <p>
          <span className="font-semibold">Univent - Event Management Services</span><br />
          Email: <a href="mailto:support@univent.com" className="text-orange-600 underline">support@univent.com</a><br />
          Phone: (123) 456-7890
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;