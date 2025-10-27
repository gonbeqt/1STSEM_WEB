import React from 'react';
import { Skeleton } from './Skeleton';

export const TaxSummarySkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="flex gap-4">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-24 self-end" />
      </div>
    </div>

    {/* Action Buttons Skeleton */}
    <div className="flex justify-end gap-3">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Table View Skeleton */}
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Table Rows */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-200 grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>

    {/* Summary Section Skeleton */}
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <Skeleton className="h-5 w-48 mb-3" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" variant="circle" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  </div>
);

export const TaxSummaryChartSkeleton: React.FC = () => (
  <div className="space-y-6 h-full overflow-y-auto p-6">
    {/* Chart Cards Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      ))}
    </div>

    {/* Summary Section Skeleton */}
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

export const ReportTableSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Header Skeleton */}
    <div className="space-y-4 mb-6">
      <Skeleton className="h-8 w-48" />
    </div>

    {/* Table Skeleton */}
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Table Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ReportChartSkeleton: React.FC<{ title?: string }> = ({ title = 'Report' }) => (
  <div className="space-y-6 p-6">
    {/* View Toggle Skeleton */}
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>

    {/* Chart Card Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-72 w-full rounded" />
        </div>
      ))}
    </div>

    {/* Summary Card Skeleton */}
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  </div>
);

export const CompactReportSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    {/* Header */}
    <Skeleton className="h-6 w-32 mb-6" />

    {/* List Items */}
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex-1">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);
