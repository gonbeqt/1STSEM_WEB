import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { container } from '../../../../di/container';
import {
  RiskAnalysisAlert,
  RiskAnalysisGenerateRequest,
  RiskAnalysisPeriod
} from '../../../../domain/entities/ReportEntities';

type AlertSeverity = 'high' | 'medium' | 'low';

interface AlertData {
  id?: string;
  title: string;
  description?: string;
  severity: AlertSeverity;
  recommendation?: string;
  category?: string;
}

const PERIOD_LABELS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] as const;
type PeriodLabel = typeof PERIOD_LABELS[number];

const PERIOD_LABEL_TO_KEY: Record<PeriodLabel, RiskAnalysisPeriod> = {
  Daily: 'DAILY',
  Weekly: 'WEEKLY',
  Monthly: 'MONTHLY',
  Quarterly: 'QUARTERLY',
  Yearly: 'YEARLY'
};

const ReportsComponent: React.FC = () => {
  const navigate = useNavigate();
  const riskAnalysisViewModel = useMemo(() => container.riskAnalysisViewModel(), []);
  const [activeCategory, setActiveCategory] = useState('Financial Statements');
  const [activePeriod, setActivePeriod] = useState<PeriodLabel>('Daily');

  const reportCategories = [
    {
      name: 'Financial Statements',
      types: [
        { name: 'Balance Sheet', icon: 'balance-icon', path: '/balance_sheet' },
        { name: 'Income Statement', icon: 'income-icon', path: '/income' },
        { name: 'Cash Flow', icon: 'cashflow-icon', path: '/cash_flow' },
        { name: 'Investment', icon: 'investment-icon', path: '/invest' }
      ]
    },
    {
      name: 'Payroll Reports',
      types: [
        { name: 'Payroll Summary', icon: 'payroll-icon', path: '/payroll_summary' }
      ]
    },
    {
      name: 'Tax Reports',
      types: [
        { name: 'Tax Summary', icon: 'tax-icon', path: '/tax_summary' }
      ]
    }
  ];

  const periodKey = PERIOD_LABEL_TO_KEY[activePeriod];

  const getStartOfWeek = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  };

  const buildRequestPayload = (period: RiskAnalysisPeriod): RiskAnalysisGenerateRequest => {
    const now = new Date();
    const formatDate = (value: Date) => value.toISOString().split('T')[0];
    const currentYear = now.getFullYear();
    const monthIndex = now.getMonth() + 1;
    const quarter = Math.floor((monthIndex - 1) / 3) + 1;

    switch (period) {
      case 'DAILY':
        return { date: formatDate(now) };
      case 'WEEKLY':
        return { start_date: formatDate(getStartOfWeek(now)) };
      case 'MONTHLY':
        return { year: currentYear, month: monthIndex };
      case 'QUARTERLY':
        return { year: currentYear, quarter };
      case 'YEARLY':
        return { year: currentYear };
      default:
        return {};
    }
  };

  const normalizeSeverity = (severity?: string): AlertSeverity => {
    const normalized = (severity || 'low').toString().toLowerCase();
    if (normalized === 'high' || normalized === 'medium') {
      return normalized;
    }
    return 'low';
  };

  const mapAlerts = (alerts?: RiskAnalysisAlert[]): AlertData[] => {
    if (!alerts || !Array.isArray(alerts)) {
      return [];
    }
    return alerts.map((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      recommendation: alert.recommendation,
      severity: normalizeSeverity(alert.severity),
      category: alert.category
    }));
  };

  const getLastUpdatedText = (periodLabel: string, generatedAt?: string) => {
    if (generatedAt) {
      const timestamp = new Date(generatedAt);
      if (!Number.isNaN(timestamp.getTime())) {
        return `Generated ${timestamp.toLocaleString()}`;
      }
    }

    switch (periodLabel) {
      case 'Daily':
        return 'Last updated Today';
      case 'Weekly':
        return 'Last updated This Week';
      case 'Monthly':
        return 'Last updated This Month';
      case 'Quarterly':
        return 'Last updated This Quarter';
      case 'Yearly':
        return 'Last updated This Year';
      default:
        return 'Last updated Recently';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'high':
        return '!';
      case 'medium':
        return '?';
      case 'low':
      default:
        return 'i';
    }
  };

  const getIconContent = (iconClass: string) => {
    switch (iconClass) {
      case 'balance-icon':
        return 'BS';
      case 'income-icon':
        return '$';
      case 'cashflow-icon':
        return 'CF';
      case 'investment-icon':
        return 'IV';
      case 'payroll-icon':
        return 'PR';
      case 'tax-icon':
        return 'TX';
      default:
        return 'RP';
    }
  };

  useEffect(() => {
    if (!periodKey) {
      return;
    }

    const payload = buildRequestPayload(periodKey);

    const loadAnalysis = async () => {
      const latestLoaded = await riskAnalysisViewModel.fetchLatest(periodKey);
      if (!latestLoaded || !riskAnalysisViewModel.hasAnalysis(periodKey)) {
        await riskAnalysisViewModel.generate(periodKey, payload);
      }
    };

    loadAnalysis();
  }, [activePeriod, periodKey, riskAnalysisViewModel]);

  const currentAnalysis = periodKey ? riskAnalysisViewModel.getAnalysis(periodKey) : undefined;
  const currentAlerts = mapAlerts(currentAnalysis?.alerts);
  const periodLoading = periodKey ? riskAnalysisViewModel.isLoading(periodKey) : false;
  const periodError = periodKey ? riskAnalysisViewModel.getError(periodKey) : null;
  const analysisSummary = currentAnalysis?.summary || currentAnalysis?.ai_overview;
  const rawRecommendations = currentAnalysis?.recommendations ?? currentAnalysis?.action_items;
  const recommendationsList = Array.isArray(rawRecommendations)
    ? rawRecommendations
    : rawRecommendations
    ? [rawRecommendations]
    : [];
  const summaryCardVisible = Boolean(analysisSummary) || recommendationsList.length > 0;
  const lastUpdatedLabel = getLastUpdatedText(activePeriod, currentAnalysis?.generated_at);
  const showDefaultCard = !periodLoading && !periodError && currentAlerts.length === 0;

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };

  const handlePeriodChange = (label: PeriodLabel) => {
    setActivePeriod(label);
  };

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleRefreshAnalysis = () => {
    if (!periodKey) {
      return;
    }

    const payload = buildRequestPayload(periodKey);
    riskAnalysisViewModel.generate(periodKey, payload);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />
      <div className="w-full mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 md:flex-row">
          {reportCategories.map((category) => (
            <div
              key={category.name}
              className={`px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 ${
                activeCategory === category.name ? 'bg-purple-600 border-purple-600 text-white' : ''
              } md:text-center`}
              onClick={() => handleCategoryChange(category.name)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg w-fit">
          {PERIOD_LABELS.map((label) => (
            <button
              key={label}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activePeriod === label
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handlePeriodChange(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-1">
          {reportCategories
            .find((category) => category.name === activeCategory)
            ?.types.map((type) => (
              <div
                key={type.name}
                className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md min-h-[120px] justify-center text-center md:p-5 md:min-h-[100px]"
                onClick={() => handleReportTypeClick(type.path)}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-base md:w-8 md:h-8 md:text-sm ${
                    type.icon === 'balance-icon'
                      ? 'bg-gradient-to-br from-indigo-400 to-purple-600'
                      : type.icon === 'income-icon'
                      ? 'bg-gradient-to-br from-pink-400 to-red-400'
                      : type.icon === 'cashflow-icon'
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400'
                      : type.icon === 'investment-icon'
                      ? 'bg-gradient-to-br from-green-400 to-teal-400'
                      : type.icon === 'payroll-icon'
                      ? 'bg-gradient-to-br from-rose-400 to-yellow-400'
                      : 'bg-gradient-to-br from-teal-200 to-pink-200'
                  }`}
                >
                  {getIconContent(type.icon)}
                </div>
                <div className="flex flex-col gap-1 items-center mt-3">
                  <span className="text-base font-semibold text-gray-900 md:text-sm">{type.name}</span>
                  <span className="text-xs text-gray-500">{lastUpdatedLabel}</span>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight md:text-2xl sm:text-xl">
                Risk Assessment - {activePeriod}
              </h2>
              <p className="text-sm text-gray-500">{lastUpdatedLabel}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRefreshAnalysis}
              disabled={periodLoading}
            >
              {periodLoading ? 'Refreshing...' : 'Refresh Insights'}
            </button>
          </div>

          {periodError && (
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {periodError}
            </div>
          )}

          {summaryCardVisible && (
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
              {analysisSummary && <p className="text-sm text-gray-600 leading-relaxed mb-3">{analysisSummary}</p>}
              {recommendationsList.length > 0 && (
                <div>
                  <strong className="text-sm text-gray-900">Recommended Actions:</strong>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                    {recommendationsList.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {periodLoading && currentAlerts.length === 0 && !periodError ? (
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm text-sm text-gray-500">
                Loading risk insights...
              </div>
            ) : currentAlerts.length > 0 ? (
              currentAlerts.map((alert) => (
                <div
                  key={alert.id || alert.title}
                  className={`p-5 rounded-xl bg-white border border-gray-200 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
                    alert.severity === 'high'
                      ? 'border-l-red-500 bg-gradient-to-br from-white to-red-50'
                      : alert.severity === 'medium'
                      ? 'border-l-amber-500 bg-gradient-to-br from-white to-amber-50'
                      : 'border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                        alert.severity === 'high'
                          ? 'bg-red-500'
                          : alert.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    >
                      {getSeverityIcon(alert.severity)}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 flex-1">{alert.title}</span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                        alert.severity === 'high'
                          ? 'bg-red-100 text-red-600 border-red-200'
                          : alert.severity === 'medium'
                          ? 'bg-amber-100 text-amber-600 border-amber-200'
                          : 'bg-emerald-100 text-emerald-600 border-emerald-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  {alert.description && (
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{alert.description}</p>
                  )}
                  {alert.recommendation && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                      <strong className="text-gray-900 font-semibold">Recommendation:</strong> {alert.recommendation}
                    </div>
                  )}
                </div>
              ))
            ) : showDefaultCard ? (
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs bg-emerald-500">
                    +
                  </span>
                  <span className="text-lg font-semibold text-gray-900 flex-1">No Major Issues</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-600 border border-emerald-200">
                    Good
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  No significant risks detected for the {activePeriod.toLowerCase()} period.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                  <strong className="text-gray-900 font-semibold">Recommendation:</strong> Continue monitoring key
                  financial metrics and maintain current operational practices.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ReportsComponent);
