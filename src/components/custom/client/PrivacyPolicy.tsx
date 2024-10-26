import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      {/* Top Label */}
      <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-8">
        Privacy Policy
      </h1>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl text-lg leading-relaxed text-gray-800 space-y-6">
        <p>
          At <span className="font-semibold">Univent - Event Management Services</span>, we are committed to protecting the privacy of our clients and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our website or services.
        </p>

        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <p>
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Contact us via our website or other communication channels.</li>
          <li>Register for an event or request our event management services.</li>
          <li>Subscribe to our newsletters or marketing materials.</li>
        </ul>
        <p>
          This personal information may include your name, email address, phone number, and event details.
        </p>

        <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
        <p>
          We use the personal information collected for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide and manage our event management services.</li>
          <li>To communicate with you regarding your event or inquiry.</li>
          <li>To send you promotional materials, updates, or other relevant communications.</li>
          <li>To improve our website and services based on user feedback.</li>
        </ul>

        <h2 className="text-2xl font-bold">3. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted partners or service providers solely for the purpose of delivering our services, such as venues, vendors, or event suppliers, under strict confidentiality agreements.
        </p>

        <h2 className="text-2xl font-bold">4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-bold">5. Cookies and Tracking Technologies</h2>
        <p>
          Our website may use cookies or similar tracking technologies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our website.
        </p>

        <h2 className="text-2xl font-bold">6. Your Rights</h2>
        <p>
          You have the right to request access to, correction of, or deletion of your personal information that we hold. You can also opt out of receiving our promotional communications at any time by following the unsubscribe instructions in the email or contacting us directly.
        </p>

        <h2 className="text-2xl font-bold">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or relevant legal requirements. We encourage you to review this page periodically for the latest information on our privacy practices.
        </p>

        <h2 className="text-2xl font-bold">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:
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

export default PrivacyPolicy;
