import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const shapes = {
    text: 'h-4 w-full rounded-md',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div className={`animate-shimmer ${shapes[variant]} ${className}`} />
  );
};
