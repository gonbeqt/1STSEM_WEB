// src/Presentation/pages/manager/home/Modal/GenerateReportModal/GenerateReportModal.tsx
import React, { useState } from "react";
import { X, CheckCircle, FileText, Download, Mail } from "lucide-react";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [reportType, setReportType] = useState<"Payroll" | "Tax" | "Summary">("Payroll");
  const [timePeriod, setTimePeriod] = useState<string>("Current Period");
  const [format, setFormat] = useState<"PDF" | "EXCEL" | "CSV">("PDF");
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [emailReport, setEmailReport] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 text-black"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Step 1: Form */}
        {step === "form" && (
          <div>
            <p className="text-gray-600 text-sm mb-4">
              Select report type and options to generate a report instantly.
            </p>

            {/* Report Type */}
            <div className="mb-4">
              <h4 className="text-sm mb-2 text-gray-700 font-medium">Report Type</h4>
              <div className="flex flex-wrap gap-2">
                {["Payroll", "Tax", "Summary"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 border rounded-lg cursor-pointer text-sm text-gray-700 transition-colors ${
                      reportType === type 
                        ? "border-purple-600 bg-purple-50 text-purple-600" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                    onClick={() => setReportType(type as "Payroll" | "Tax" | "Summary")}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="mb-4">
              <h4 className="text-sm mb-2 text-gray-700 font-medium">Time Period</h4>
              <div className="flex flex-wrap gap-2">
                {["Current Period", "Previous Period", "Year to Date", "Custom Period"].map((period) => (
                  <button
                    key={period}
                    className={`px-4 py-2 border rounded-lg cursor-pointer text-sm text-gray-700 transition-colors ${
                      timePeriod === period 
                        ? "border-purple-600 bg-purple-50 text-purple-600" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="mb-4">
              <h4 className="text-sm mb-2 text-gray-700 font-medium">Format</h4>
              <div className="flex flex-wrap gap-2">
                {["PDF", "EXCEL", "CSV"].map((f) => (
                  <button
                    key={f}
                    className={`px-4 py-2 border rounded-lg cursor-pointer text-sm text-gray-700 transition-colors ${
                      format === f 
                        ? "border-purple-600 bg-purple-50 text-purple-600" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                    onClick={() => setFormat(f as "PDF" | "EXCEL" | "CSV")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mb-2 text-sm text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBreakdown}
                  onChange={() => setIncludeBreakdown(!includeBreakdown)}
                  className="w-4 h-4 text-purple-600"
                />
                Include detailed breakdown
              </label>
            </div>
            <div className="mb-4 text-sm text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailReport}
                  onChange={() => setEmailReport(!emailReport)}
                  className="w-4 h-4 text-purple-600"
                />
                Email report when generated
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2 mt-5">
              <button 
                className="flex-1 bg-gray-100 text-gray-700 border-none py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-purple-600 text-white border-none py-2 px-4 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                onClick={() => setStep("success")}
              >
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === "success" && (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Generated!</h3>
            <p className="text-gray-600 mb-5">
              Your <strong>{reportType} Report</strong> has been created successfully
            </p>

            <div className="border border-gray-200 rounded-lg p-4 mb-5 flex items-center gap-3 bg-gray-50">
              <FileText size={40} className="text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 m-0">{reportType} Report</p>
                <p className="text-xs text-gray-600 m-0">{timePeriod}</p>
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-4">
              <button className="flex-1 bg-purple-600 text-white border-none py-2 px-4 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                <Download size={16} /> Download
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 border-none py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <Mail size={16} /> Email
              </button>
            </div>

            <button
              className="w-full mt-4 bg-transparent border-none text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => setStep("form")}
            >
              Generate Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportModal;