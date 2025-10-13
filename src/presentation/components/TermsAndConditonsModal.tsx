import React, { useEffect, useRef, useState } from "react";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsAndConditonsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHasReachedEnd(false);
      contentRef.current?.scrollTo({ top: 0 });
    }
  }, [isOpen]);

  const handleScroll = () => {
    const container = contentRef.current;
    if (!container || hasReachedEnd) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      setHasReachedEnd(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <header className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Terms and Conditions</h2>
        </header>

        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm leading-6 text-gray-700"
        >
          <h3 className="mb-2 text-lg font-semibold">Terms and Conditions</h3>
          <p className="mb-4">
            Welcome to Cryphoria. By downloading, accessing, or using our
            application, you agree to the following Terms and Conditions. Please
            read them carefully before using our services.
          </p>

          <h4 className="mb-1 font-semibold">Acceptance of Terms</h4>
          <p className="mb-4">
            By creating an account or using the app, you agree to comply with
            these Terms and Conditions and any applicable laws and regulations.
            If you do not agree, please discontinue using the app.
          </p>

          <h4 className="mb-1 font-semibold">Data Collection and Usage</h4>
          <p className="mb-4">
            To provide our services, we collect and process certain information.
            This may include personal and business details such as employee
            names and business credentials, as well as financial data including
            budgets, wallet addresses, and transaction records. The information
            you provide will be used solely to deliver and improve our services
            in compliance with applicable data protection laws.
          </p>

          <h4 className="mb-1 font-semibold">Service Limitations</h4>
          <p className="mb-4">
            At present, the functionalities available within the app represent
            the full extent of our services, and we cannot guarantee additional
            features or services outside of what is currently provided.
          </p>

          <h4 className="mb-1 font-semibold">Financial Transactions Disclaimer</h4>
          <p className="mb-4">
            Users are solely responsible for ensuring the accuracy of all wallet
            addresses and transaction details they enter. We are not liable for
            any loss of funds resulting from incorrect recipient information,
            fraudulent activities, or investment scams outside our platform.
          </p>

          <h4 className="mb-1 font-semibold">Use of AI and Automation</h4>
          <p className="mb-4">
            Our application uses Artificial Intelligence (AI) and Large Language
            Models (LLMs) to automate certain accounting and financial tasks.
            While we strive for accuracy, automated outputs may not always be
            completely correct. Users are advised to carefully review all
            AI-generated reports and suggestions before making financial
            decisions, as we are not liable for decisions made solely on
            AI-generated content.
          </p>

          <h4 className="mb-1 font-semibold">User Responsibilities</h4>
          <p className="mb-4">
            You are responsible for the accuracy of the data you provide and for
            safeguarding your account information. The app must be used only for
            lawful purposes, and any misuse for fraudulent or illegal activities
            will result in the termination of your access.
          </p>

          <h4 className="mb-1 font-semibold">Amendments</h4>
          <p className="mb-4">
            We reserve the right to update these Terms and Conditions at any
            time. Any changes will take effect immediately upon being published,
            and continued use of the app constitutes acceptance of the revised
            terms.
          </p>

          <h4 className="mb-1 font-semibold">Contact Us</h4>
          <p className="mb-4">
            For questions or concerns about these Terms and Conditions, please
            contact us at:{" "}
            <a
              href="mailto:cryphoria@gmail.com"
              className="text-purple-600 underline"
            >
              cryphoria@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-4 px-6 py-4">
          <label
            className={`flex items-start gap-3 text-sm ${
              hasReachedEnd ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <input
              type="checkbox"
              readOnly
              disabled={!hasReachedEnd}
              checked={hasReachedEnd}
              className="mt-1 h-4 w-4 accent-purple-600"
            />
            <span>I agree to the Terms and Conditions and Privacy Policy</span>
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onAccept}
              disabled={!hasReachedEnd}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                hasReachedEnd
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "cursor-not-allowed bg-purple-300"
              }`}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditonsModal;