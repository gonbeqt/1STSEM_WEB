import React, { forwardRef, HTMLAttributes } from 'react';

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'rounded' | 'circle' | 'square';
};

const baseVariants: Record<NonNullable<SkeletonProps['variant']>, string> = {
  rounded: 'rounded-xl',
  circle: 'rounded-full',
  square: 'rounded-md',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', variant = 'rounded', ...props }, ref) => {
    const shapeClasses = baseVariants[variant] ?? baseVariants.rounded;

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 ${shapeClasses} animate-pulse ${className}`.trim()}
        {...props}
      >
        <span className="opacity-0">&nbsp;</span>
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export const SkeletonText: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <Skeleton className={`h-4 ${className}`} {...props} />
);

export const SkeletonCircle: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <Skeleton variant="circle" className={`h-12 w-12 ${className}`} {...props} />
);

export default Skeleton;
