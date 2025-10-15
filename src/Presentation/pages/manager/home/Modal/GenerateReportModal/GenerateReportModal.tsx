// src/Presentation/pages/manager/home/Modal/GenerateReportModal/GenerateReportModal.tsx
import React, { useState } from "react";
import { X, CheckCircle, FileText, Download, Mail, Loader2, AlertCircle } from "lucide-react";
import { sumObjectValues, getDateRangeForPeriod, ProgressBar } from '../../utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"form" | "success" | "loading">("form");
  const [reportType, setReportType] = useState<"Cashflow" | "Tax" | "BalanceSheet">("Cashflow");
  const [timePeriod, setTimePeriod] = useState<string>("Current Period");
  const [format, setFormat] = useState<"PDF" | "EXCEL" | "CSV">("PDF");
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [emailReport, setEmailReport] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Use shared helpers for sum and date ranges
  // sumObjectValues and getDateRangeForPeriod are imported from ../utils

  // Generate cash flow report
  const generateCashFlowReport = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
  const { start_date, end_date } = getDateRangeForPeriod(timePeriod, customStartDate, customEndDate);
      
      if (timePeriod === "Custom Period" && (!customStartDate || !customEndDate)) {
        setError("Please select custom start and end dates");
        setIsGenerating(false);
        return;
      }

      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cash-flow/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          start_date,
          end_date
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGeneratedReport(data.cash_flow_statement);
        setStep("success");
      } else {
        setError(data.error || 'Failed to generate cash flow report');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate cash flow report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate tax analysis report
  const generateTaxAnalysisReport = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/tax-analysis/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          period_type: timePeriod === "Custom Period" ? "CUSTOM" : 
                      timePeriod === "Current Period" ? "MONTHLY" :
                      timePeriod === "Previous Period" ? "MONTHLY" :
                      timePeriod === "Year to Date" ? "YEARLY" : "MONTHLY",
          start_date: timePeriod === "Custom Period" ? customStartDate : getDateRangeForPeriod(timePeriod, customStartDate, customEndDate).start_date,
          end_date: timePeriod === "Custom Period" ? customEndDate : getDateRangeForPeriod(timePeriod, customStartDate, customEndDate).end_date,
          total_gains: 0, // Will be calculated by backend
          total_losses: 0 // Will be calculated by backend
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGeneratedReport({
          type: 'tax_analysis',
          analysis: data.analysis,
          period_start: timePeriod === "Custom Period" ? customStartDate : getDateRangeForPeriod(timePeriod, customStartDate, customEndDate).start_date,
          period_end: timePeriod === "Custom Period" ? customEndDate : getDateRangeForPeriod(timePeriod, customStartDate, customEndDate).end_date,
          generated_at: new Date().toISOString()
        });
        setStep("success");
      } else {
        setError(data.error || 'Failed to generate tax analysis report');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate tax analysis report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate balance sheet report
  const generateBalanceSheetReport = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      // For balance sheet, we use the end date as the "as of" date
  const { end_date } = getDateRangeForPeriod(timePeriod, customStartDate, customEndDate);
      
      const response = await fetch(`${API_URL}/balance-sheet/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          as_of_date: end_date,
          include_all_assets: true
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGeneratedReport({
          type: 'balance_sheet',
          balance_sheet: data.balance_sheet,
          as_of_date: data.balance_sheet.as_of_date,
          generated_at: new Date().toISOString()
        });
        setStep("success");
      } else {
        setError(data.error || 'Failed to generate balance sheet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate balance sheet');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!generatedReport) return;
    
    try {
      let excelData: any[] = [];
      
      if (generatedReport.type === 'tax_analysis') {
        excelData = [
          ['TAX ANALYSIS REPORT'],
          [`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['AI ANALYSIS', ''],
          ['Analysis', generatedReport.analysis]
        ];
      } else if (generatedReport.type === 'balance_sheet') {
        const balanceSheet = generatedReport.balance_sheet;
        excelData = [
          ['BALANCE SHEET'],
          [`As of: ${balanceSheet.as_of_date}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['ASSETS', ''],
          ['Current Assets', sumObjectValues(balanceSheet.assets?.current_assets)],
          ['Fixed Assets', sumObjectValues(balanceSheet.assets?.fixed_assets)],
          ['Total Assets', balanceSheet.totals?.total_assets || 0],
          [''],
          ['LIABILITIES', ''],
          ['Current Liabilities', sumObjectValues(balanceSheet.liabilities?.current_liabilities)],
          ['Long-term Liabilities', sumObjectValues(balanceSheet.liabilities?.long_term_liabilities)],
          ['Total Liabilities', balanceSheet.totals?.total_liabilities || 0],
          [''],
          ['EQUITY', ''],
          ['Owner Equity', balanceSheet.equity?.owner_equity || 0],
          ['Retained Earnings', balanceSheet.equity?.retained_earnings || 0],
          ['Total Equity', balanceSheet.totals?.total_equity || 0],
          [''],
          ['BALANCE CHECK', ''],
          ['Assets = Liabilities + Equity', balanceSheet.totals?.balance_check === 0 ? 'BALANCED' : 'UNBALANCED']
        ];
      } else {
        excelData = [
          ['CASH FLOW STATEMENT'],
          [`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['OPERATING ACTIVITIES', ''],
          ['Net Income', generatedReport.cash_summary.net_cash_from_operations],
          [''],
          ['INVESTING ACTIVITIES', ''],
          ['Net Cash from Investing', generatedReport.cash_summary.net_cash_from_investing],
          [''],
          ['FINANCING ACTIVITIES', ''],
          ['Net Cash from Financing', generatedReport.cash_summary.net_cash_from_financing],
          [''],
          ['CASH SUMMARY', ''],
          ['Beginning Cash', generatedReport.cash_summary.beginning_cash],
          ['Net Change in Cash', generatedReport.cash_summary.net_change_in_cash],
          ['Ending Cash', generatedReport.cash_summary.ending_cash]
        ];
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      ws['!cols'] = [{ wch: 25 }, { wch: 15 }];
      
      let sheetName = 'Report';
      if (generatedReport.type === 'tax_analysis') sheetName = 'Tax Analysis';
      else if (generatedReport.type === 'balance_sheet') sheetName = 'Balance Sheet';
      else sheetName = 'Cash Flow Statement';
      
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      let fileName = 'Report';
      if (generatedReport.type === 'tax_analysis') fileName = `TaxAnalysis_${new Date().toISOString().split('T')[0]}.xlsx`;
      else if (generatedReport.type === 'balance_sheet') fileName = `BalanceSheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      else fileName = `CashFlowStatement_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      saveAs(blob, fileName);
    } catch (err: any) {
      setError('Failed to export to Excel');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!generatedReport) return;
    
    try {
      let csvContent: string;
      
      if (generatedReport.type === 'tax_analysis') {
        csvContent = [
          ['TAX ANALYSIS REPORT'],
          [`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['AI ANALYSIS', ''],
          ['Analysis', generatedReport.analysis]
        ].map(row => row.join(',')).join('\n');
      } else if (generatedReport.type === 'balance_sheet') {
        const balanceSheet = generatedReport.balance_sheet;
        csvContent = [
          ['BALANCE SHEET'],
          [`As of: ${balanceSheet.as_of_date}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['ASSETS', ''],
          ['Current Assets', sumObjectValues(balanceSheet.assets?.current_assets)],
          ['Fixed Assets', sumObjectValues(balanceSheet.assets?.fixed_assets)],
          ['Total Assets', balanceSheet.totals?.total_assets || 0],
          [''],
          ['LIABILITIES', ''],
          ['Current Liabilities', sumObjectValues(balanceSheet.liabilities?.current_liabilities)],
          ['Long-term Liabilities', sumObjectValues(balanceSheet.liabilities?.long_term_liabilities)],
          ['Total Liabilities', balanceSheet.totals?.total_liabilities || 0],
          [''],
          ['EQUITY', ''],
          ['Owner Equity', balanceSheet.equity?.owner_equity || 0],
          ['Retained Earnings', balanceSheet.equity?.retained_earnings || 0],
          ['Total Equity', balanceSheet.totals?.total_equity || 0],
          [''],
          ['BALANCE CHECK', ''],
          ['Assets = Liabilities + Equity', balanceSheet.totals?.balance_check === 0 ? 'BALANCED' : 'UNBALANCED']
        ].map(row => row.join(',')).join('\n');
      } else {
        csvContent = [
          ['CASH FLOW STATEMENT'],
          [`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [''],
          ['OPERATING ACTIVITIES', ''],
          ['Net Income', generatedReport.cash_summary.net_cash_from_operations],
          [''],
          ['INVESTING ACTIVITIES', ''],
          ['Net Cash from Investing', generatedReport.cash_summary.net_cash_from_investing],
          [''],
          ['FINANCING ACTIVITIES', ''],
          ['Net Cash from Financing', generatedReport.cash_summary.net_cash_from_financing],
          [''],
          ['CASH SUMMARY', ''],
          ['Beginning Cash', generatedReport.cash_summary.beginning_cash],
          ['Net Change in Cash', generatedReport.cash_summary.net_change_in_cash],
          ['Ending Cash', generatedReport.cash_summary.ending_cash]
        ].map(row => row.join(',')).join('\n');
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      let fileName = 'Report';
      if (generatedReport.type === 'tax_analysis') fileName = `TaxAnalysis_${new Date().toISOString().split('T')[0]}.csv`;
      else if (generatedReport.type === 'balance_sheet') fileName = `BalanceSheet_${new Date().toISOString().split('T')[0]}.csv`;
      else fileName = `CashFlowStatement_${new Date().toISOString().split('T')[0]}.csv`;
      
      saveAs(blob, fileName);
    } catch (err: any) {
      setError('Failed to export to CSV');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!generatedReport) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      
      if (generatedReport.type === 'tax_analysis') {
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX ANALYSIS REPORT', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Period and generation date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;
        
        // AI Analysis Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('AI ANALYSIS', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        // Split analysis text into lines that fit the page
        const analysisText = generatedReport.analysis || 'No analysis available';
        const lines = doc.splitTextToSize(analysisText, pageWidth - 40);
        
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 6;
        });
        
        // Save the PDF
        const fileName = `TaxAnalysis_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
      } else if (generatedReport.type === 'balance_sheet') {
        // Balance Sheet PDF
        const balanceSheet = generatedReport.balance_sheet;
        
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('BALANCE SHEET', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        // As of date and generation date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`As of: ${balanceSheet.as_of_date}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;
        
        // Assets Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ASSETS', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Current Assets:', 20, yPosition);
        doc.text(`$${sumObjectValues(balanceSheet.assets?.current_assets).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Fixed Assets:', 20, yPosition);
        doc.text(`$${sumObjectValues(balanceSheet.assets?.fixed_assets).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 12;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total Assets:', 20, yPosition);
        doc.text(`$${(balanceSheet.totals?.total_assets || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 20;
        
        // Liabilities Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('LIABILITIES', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Current Liabilities:', 20, yPosition);
        doc.text(`$${sumObjectValues(balanceSheet.liabilities?.current_liabilities).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Long-term Liabilities:', 20, yPosition);
        doc.text(`$${sumObjectValues(balanceSheet.liabilities?.long_term_liabilities).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 12;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total Liabilities:', 20, yPosition);
        doc.text(`$${(balanceSheet.totals?.total_liabilities || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 20;
        
        // Equity Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EQUITY', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Owner Equity:', 20, yPosition);
        doc.text(`$${(balanceSheet.equity?.owner_equity || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Retained Earnings:', 20, yPosition);
        doc.text(`$${(balanceSheet.equity?.retained_earnings || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 12;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total Equity:', 20, yPosition);
        doc.text(`$${(balanceSheet.totals?.total_equity || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 20;
        
        // Balance Check
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BALANCE CHECK', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Assets = Liabilities + Equity:', 20, yPosition);
        const balanceStatus = balanceSheet.totals?.balance_check === 0 ? 'BALANCED' : 'UNBALANCED';
        if (balanceSheet.totals?.balance_check === 0) {
          doc.setTextColor(0, 128, 0); // Green for balanced
        } else {
          doc.setTextColor(255, 0, 0); // Red for unbalanced
        }
        doc.text(balanceStatus, pageWidth - 20, yPosition, { align: 'right' });
        doc.setTextColor(0, 0, 0); // Reset to black
        
        // Save the PDF
        const fileName = `BalanceSheet_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
      } else {
        // Cash Flow Statement PDF (existing code)
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('CASH FLOW STATEMENT', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Period and generation date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Period: ${generatedReport.period_start} to ${generatedReport.period_end}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;
        
        // Operating Activities
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('OPERATING ACTIVITIES', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Net Cash from Operations:', 20, yPosition);
        doc.text(`$${generatedReport.cash_summary.net_cash_from_operations}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 15;
        
        // Investing Activities
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('INVESTING ACTIVITIES', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Net Cash from Investing:', 20, yPosition);
        doc.text(`$${generatedReport.cash_summary.net_cash_from_investing}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 15;
        
        // Financing Activities
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('FINANCING ACTIVITIES', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Net Cash from Financing:', 20, yPosition);
        doc.text(`$${generatedReport.cash_summary.net_cash_from_financing}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 20;
        
        // Cash Summary
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CASH SUMMARY', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Beginning Cash:', 20, yPosition);
        doc.text(`$${generatedReport.cash_summary.beginning_cash}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Net Change in Cash:', 20, yPosition);
        const netChange = generatedReport.cash_summary.net_change_in_cash;
        if (netChange >= 0) {
          doc.setTextColor(0, 128, 0); // Green for positive
        } else {
          doc.setTextColor(255, 0, 0); // Red for negative
        }
        doc.text(`$${netChange}`, pageWidth - 20, yPosition, { align: 'right' });
        doc.setTextColor(0, 0, 0); // Reset to black
        yPosition += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Ending Cash:', 20, yPosition);
        doc.text(`$${generatedReport.cash_summary.ending_cash}`, pageWidth - 20, yPosition, { align: 'right' });
        
        // Save the PDF
        const fileName = `CashFlowStatement_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
      }
      
      // Add footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by Financial Management System', pageWidth / 2, pageHeight - 20, { align: 'center' });
      
    } catch (err: any) {
      setError('Failed to export to PDF');
    }
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    if (reportType === "Cashflow") {
      await generateCashFlowReport();
    } else if (reportType === "Tax") {
      await generateTaxAnalysisReport();
    } else if (reportType === "BalanceSheet") {
      await generateBalanceSheetReport();
    } else {
      // For other report types, just show success for now
      setStep("success");
    }
  };

  // Handle download based on format
  const handleDownload = () => {
    if (format === "EXCEL") {
      exportToExcel();
    } else if (format === "CSV") {
      exportToCSV();
    } else if (format === "PDF") {
      exportToPDF();
    }
  };

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
                {["Cashflow", "Tax", "BalanceSheet"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 border rounded-lg cursor-pointer text-sm text-gray-700 transition-colors ${
                      reportType === type 
                        ? "border-purple-600 bg-purple-50 text-purple-600" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                    onClick={() => setReportType(type as "Cashflow" | "Tax" | "BalanceSheet")}
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
              
              {/* Custom Date Inputs */}
              {timePeriod === "Custom Period" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
              )}
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

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-2 mt-5">
              <button 
                className="flex-1 bg-gray-100 text-gray-700 border-none py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors" 
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-purple-600 text-white border-none py-2 px-4 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
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

            {/* Report Summary */}
            {generatedReport && (
              <div className="border border-gray-200 rounded-lg p-4 mb-5 bg-gray-50 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={40} className="text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900 m-0">{reportType} Report</p>
                    <p className="text-xs text-gray-600 m-0">{timePeriod}</p>
                  </div>
                </div>
                
                {reportType === "Cashflow" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period:</span>
                      <span className="font-medium">{generatedReport.period_start} to {generatedReport.period_end}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Beginning Cash:</span>
                      <span className="font-medium">${generatedReport.cash_summary.beginning_cash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ending Cash:</span>
                      <span className="font-medium">${generatedReport.cash_summary.ending_cash}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Net Change:</span>
                      <span className={`font-bold ${generatedReport.cash_summary.net_change_in_cash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${generatedReport.cash_summary.net_change_in_cash}
                      </span>
                    </div>
                  </div>
                )}
                
                {reportType === "Tax" && generatedReport.type === 'tax_analysis' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Period:</span>
                      <span className="font-medium">{generatedReport.period_start} to {generatedReport.period_end}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analysis Type:</span>
                      <span className="font-medium">AI-Powered Tax Analysis</span>
                    </div>
                    <div className="border-t pt-2">
                      <span className="text-gray-600 block mb-1">AI Analysis Preview:</span>
                      <div className="text-xs text-gray-700 bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                        {generatedReport.analysis ? 
                          generatedReport.analysis.substring(0, 200) + (generatedReport.analysis.length > 200 ? '...' : '') 
                          : 'No analysis available'
                        }
                      </div>
                    </div>
                  </div>
                )}
                
                {reportType === "BalanceSheet" && generatedReport.type === 'balance_sheet' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">As of Date:</span>
                      <span className="font-medium">{generatedReport.as_of_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Assets:</span>
                      <span className="font-medium">${generatedReport.balance_sheet?.totals?.total_assets || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Liabilities:</span>
                      <span className="font-medium">${generatedReport.balance_sheet?.totals?.total_liabilities || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Equity:</span>
                      <span className="font-medium">${generatedReport.balance_sheet?.totals?.total_equity || 0}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Balance Check:</span>
                      <span className={`font-bold ${generatedReport.balance_sheet?.totals?.balance_check === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {generatedReport.balance_sheet?.totals?.balance_check === 0 ? 'BALANCED' : 'UNBALANCED'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between gap-2 mb-4">
              <button 
                className="flex-1 bg-purple-600 text-white border-none py-2 px-4 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                onClick={handleDownload}
              >
                <Download size={16} /> Download {format}
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 border-none py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <Mail size={16} /> Email
              </button>
            </div>

            <button
              className="w-full mt-4 bg-transparent border-none text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => {
                setStep("form");
                setError("");
                setGeneratedReport(null);
              }}
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