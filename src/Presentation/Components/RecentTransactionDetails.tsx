import React from 'react';
import { KeyValueList } from '../pages/manager/home/utils';

type AiAnalysis = {
  classification?: string;
  confidence?: number;
  reasoning?: unknown;
  tags?: string[];
  metadata?: Record<string, unknown>;
  is_analyzed?: boolean;
  analysis_timestamp?: string;
  crypto_to_fiat?: Record<string, unknown>;
  [key: string]: unknown;
};

type Transaction = {
  name?: string;
  amount?: number;
  token_symbol?: string;
  type?: string; // 'outflow' | 'pending' | 'inflow'
  date?: string;
  hash?: string;
  explorer_url?: string;
  counterparty_name?: string;
  counterparty_role?: string;
  ai_analysis?: AiAnalysis | string | null;
};

type Props = {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

const InfoTile = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <div className="mt-1 text-sm text-gray-900">{children}</div>
  </div>
);

const RecentTransactionDetails: React.FC<Props> = ({ isOpen, transaction, onClose }) => {
  if (!isOpen || !transaction) return null;

  const analysis = transaction.ai_analysis;
  const analysisObject = analysis && typeof analysis === 'object' && !Array.isArray(analysis) ? (analysis as AiAnalysis) : null;
  const analysisText = typeof analysis === 'string' ? analysis : typeof analysisObject?.reasoning === 'string' ? analysisObject.reasoning : null;
  const reasoningFallback = analysisObject && analysisObject.reasoning && typeof analysisObject.reasoning !== 'string'
    ? JSON.stringify(analysisObject.reasoning, null, 2)
    : null;
  const tags = analysisObject?.tags && Array.isArray(analysisObject.tags) ? analysisObject.tags : [];
  const converted = analysisObject?.crypto_to_fiat && typeof analysisObject.crypto_to_fiat === 'object'
    ? analysisObject.crypto_to_fiat
    : null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="w-full max-w-2xl max-h-[80vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
            <p className="text-xs text-gray-500">Deep dive on this activity</p>
          </div>
          <button onClick={onClose} className="text-sm font-semibold text-purple-600 hover:text-purple-700">Close</button>
        </div>
  <div className="px-6 py-6 flex-1 overflow-y-auto">
          <section className="grid gap-4 sm:grid-cols-2">
            <InfoTile label="Name">{transaction.name || '—'}</InfoTile>
            <InfoTile label="Amount">
              {(transaction.amount || 0).toFixed(6)} {transaction.token_symbol || ''}
            </InfoTile>
            <InfoTile label="Status">
              {transaction.type === 'outflow' ? 'Outflow / Confirmed' : transaction.type === 'pending' ? 'Pending' : 'Inflow'}
            </InfoTile>
            <InfoTile label="Date">{transaction.date || '—'}</InfoTile>
          </section>

          <section className="mt-6 space-y-4">
            {transaction.hash && (
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Transaction Hash</p>
                <p className="mt-1 font-mono text-sm break-all text-gray-800">{transaction.hash}</p>
                {transaction.explorer_url && (
                  <a
                    href={transaction.explorer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Open in explorer
                  </a>
                )}
              </div>
            )}

            {transaction.counterparty_name && (
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Counterparty</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {transaction.counterparty_name}
                  {transaction.counterparty_role ? ` (${transaction.counterparty_role})` : ''}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">AI Analysis</p>
              {analysis || analysis === '' ? (
                <div className="mt-3 space-y-4 text-sm text-gray-800">
                  {analysisObject?.classification && (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        {analysisObject.classification}
                      </span>
                      {analysisObject.confidence !== undefined && (
                        <span className="text-xs text-gray-500">Confidence: {analysisObject.confidence}</span>
                      )}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag} className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisText && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reasoning</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{analysisText}</p>
                    </div>
                  )}

                  {!analysisText && reasoningFallback && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reasoning</p>
                      <pre className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-xs text-gray-700">{reasoningFallback}</pre>
                    </div>
                  )}

                  {converted && Object.keys(converted).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Converted</p>
                      <div className="mt-2">
                        <KeyValueList data={converted} />
                      </div>
                    </div>
                  )}

                  {analysisObject?.metadata && Object.keys(analysisObject.metadata).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Metadata</p>
                      <div className="mt-2">
                        <KeyValueList data={analysisObject.metadata} />
                      </div>
                    </div>
                  )}

                  {!analysisText && !reasoningFallback && !tags.length && !converted && !analysisObject?.classification && !analysisObject?.metadata && (
                    <p className="text-sm text-gray-500">No AI insights provided for this transaction.</p>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No AI analysis available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionDetails;
