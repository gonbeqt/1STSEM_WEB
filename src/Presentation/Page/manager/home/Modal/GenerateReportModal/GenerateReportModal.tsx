import React, { useState } from "react";
import { X, CheckCircle, FileText, Download, Mail } from "lucide-react";
import "./GenerateReportModal.css";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [reportType, setReportType] = useState<"Payroll" | "Tax" | "Summary">(
    "Payroll"
  );
  const [timePeriod, setTimePeriod] = useState<string>("Current Period");
  const [format, setFormat] = useState<"PDF" | "EXCEL" | "CSV">("PDF");
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [emailReport, setEmailReport] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="report-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="report-modal-container">
        {/* Header */}
        <div className="report-modal-header">
          <h2>Generate Report</h2>
          <button onClick={onClose} className="report-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Form */}
        {step === "form" && (
          <div className="report-form">
            <p className="report-description">
              Select report type and options to generate a report instantly.
            </p>

            {/* Report Type */}
            <div className="report-section">
              <h4>Report Type</h4>
              <div className="report-options">
                {["Payroll", "Tax", "Summary"].map((type) => (
                  <button
                    key={type}
                    className={`option-btn ${
                      reportType === type ? "active" : ""
                    }`}
                    onClick={() =>
                      setReportType(type as "Payroll" | "Tax" | "Summary")
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="report-section">
              <h4>Time Period</h4>
              <div className="report-options">
                {[
                  "Current Period",
                  "Previous Period",
                  "Year to Date",
                  "Custom Period",
                ].map((period) => (
                  <button
                    key={period}
                    className={`option-btn ${
                      timePeriod === period ? "active" : ""
                    }`}
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="report-section">
              <h4>Format</h4>
              <div className="report-options">
                {["PDF", "EXCEL", "CSV"].map((f) => (
                  <button
                    key={f}
                    className={`option-btn ${format === f ? "active" : ""}`}
                    onClick={() => setFormat(f as "PDF" | "EXCEL" | "CSV")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="report-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={includeBreakdown}
                  onChange={() => setIncludeBreakdown(!includeBreakdown)}
                />
                Include detailed breakdown
              </label>
            </div>
            <div className="report-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={emailReport}
                  onChange={() => setEmailReport(!emailReport)}
                />
                Email report when generated
              </label>
            </div>

            {/* Actions */}
            <div className="report-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => setStep("success")}
              >
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === "success" && (
          <div className="report-success">
            <CheckCircle className="success-icon" size={48} />
            <h3>Report Generated!</h3>
            <p>
              Your <strong>{reportType} Report</strong> has been created
              successfully
            </p>

            <div className="report-card">
              <FileText size={40} className="report-file-icon" />
              <div>
                <p className="report-file-title">{reportType} Report</p>
                <p className="report-file-sub">{timePeriod}</p>
              </div>
            </div>

            <div className="report-actions">
              <button className="btn-primary">
                <Download size={16} /> Download
              </button>
              <button className="btn-secondary">
                <Mail size={16} /> Email
              </button>
            </div>

            <button
              className="btn-tertiary"
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
