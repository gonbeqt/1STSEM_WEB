class ReportService {
  private readonly API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async generateBalanceSheet(asOfDate?: string) {
    try {
      const response = await fetch(`${this.API_URL}/balance-sheet/generate/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          as_of_date: asOfDate || new Date().toISOString().split('T')[0],
          include_all_assets: true,
          format: 'detailed'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate balance sheet');
      }

      return data;
    } catch (error) {      throw error;
    }
  }

  async generateCashFlow(startDate?: string, endDate?: string) {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/generate/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          start_date: startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          end_date: endDate || new Date().toISOString().split('T')[0]
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }

      return data;
    } catch (error) {      throw error;
    }
  }

  async generateTaxReport(startDate: string, endDate: string, reportType: string = 'CUSTOM') {
    try {
      const response = await fetch(`${this.API_URL}/tax-reports/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          report_type: reportType,
          accounting_method: 'FIFO',
          include_ai_analysis: true
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tax report');
      }

      return data;
    } catch (error) {      throw error;
    }
  }

  async exportBalanceSheetExcel(reportId?: string) {
    try {
      const queryParams = reportId ? `?balance_sheet_id=${reportId}` : '';
      const response = await fetch(`${this.API_URL}/balance-sheet/export-excel/${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to export balance sheet to Excel');
      }

      return data;
    } catch (error) {      throw error;
    }
  }

  async exportCashFlowExcel(reportId?: string) {
    try {
      const response = await fetch(`${this.API_URL}/cash-flow/export-excel/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reportId ? { cash_flow_id: reportId } : {}),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to export cash flow to Excel');
      }

      return data;
    } catch (error) {      throw error;
    }
  }

  downloadFile(base64Data: string, filename: string, contentType: string) {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {    }
  }
}

export default new ReportService();