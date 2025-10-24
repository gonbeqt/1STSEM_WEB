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
            By creating an account or accessing the application, you enter into
            a binding agreement to comply with these Terms and Conditions and
            all applicable laws and regulations governing your use of the
            services. Your continued use of the application constitutes ongoing
            acceptance of these terms as they may be modified from time to time.
          </p>

          <h4 className="mb-1 font-semibold">Data Collection and Usage</h4>
          <p className="mb-4">
            To provide our services, we collect and process certain information
            including personal and business details such as employee names and
            business credentials, as well as financial data including budgets,
            wallet addresses, and transaction records. All information collected
            is used exclusively to deliver and enhance our services. We are
            committed to safeguarding your privacy in strict accordance with the
            Data Privacy Act of 2012 (Republic Act No. 10173) of the Republic of
            the Philippines and all other applicable data protection
            legislation. Your personal data is processed securely, stored with
            appropriate confidentiality measures, and will not be disclosed to
            third parties without your explicit prior consent except where
            required by law or regulatory authority.
          </p>

          <h4 className="mb-1 font-semibold">Service Scope and Limitations</h4>
          <p className="mb-4">
            The Cryphoria platform is designed to facilitate
            cryptocurrency-based payroll distribution. At this time, the system
            only supports businesses or organizations that pay employees on a
            fixed monthly salary basis. The platform does not support or
            calculate hourly wages, commission-based compensation, attendance
            tracking, or overtime pay. Users acknowledge and accept full
            responsibility for verifying the accuracy of all payment amounts
            prior to initiating any transaction through the platform.
          </p>

          <h4 className="mb-1 font-semibold">Financial Transactions Disclaimer</h4>
          <p className="mb-4">
            Users bear sole responsibility for ensuring the accuracy of all
            wallet addresses and transaction details they enter. Cryphoria is
            not liable for any loss of funds resulting from incorrect recipient
            information, fraudulent activities, or scams occurring outside our
            platform. All cryptocurrency transactions executed through the
            platform are final and irreversible. Users are strongly advised to
            carefully verify all information before confirming any transaction.
          </p>

          <h4 className="mb-1 font-semibold">
            Artificial Intelligence and Automated Processing
          </h4>
          <p className="mb-4">
            This application leverages Artificial Intelligence (AI) and Large
            Language Models (LLMs) to streamline accounting and financial
            operations. While we maintain high standards for accuracy, users
            should be aware that AI-generated results may occasionally contain
            errors, inaccuracies, or require human verification. Users are
            responsible for reviewing and validating all automated results
            before making critical decisions.
          </p>

          <h4 className="mb-1 font-semibold">User Responsibilities</h4>
          <p className="mb-4">
            Users are required to provide accurate, complete, and current
            information and to maintain the security of their account
            credentials. The platform must be used exclusively for lawful
            purposes. Any engagement in fraudulent, illegal, or unauthorized
            activities will result in immediate termination of account access
            without prior notice and may be reported to appropriate legal and
            regulatory authorities. Users must promptly notify Cryphoria of any
            suspected unauthorized access to their account.
          </p>

          <h4 className="mb-1 font-semibold">Amendments to Terms</h4>
          <p className="mb-4">
            Cryphoria reserves the right to modify or update these Terms and
            Conditions at any time. All modifications shall become effective
            immediately upon publication within the application. Continued use
            of the application following any such modification constitutes
            binding acceptance of the revised terms. Users are encouraged to
            review these terms periodically to remain informed of any changes.
          </p>

          <h4 className="mb-1 font-semibold">Contact Us</h4>
          <p className="mb-4">
            For inquiries, concerns, or requests regarding these Terms and
            Conditions, please contact us at{" "}
            <a
              href="mailto:cryphoria.team@gmail.com"
              className="text-purple-600 underline"
            >
              cryphoria.team@gmail.com
            </a>
            .
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
