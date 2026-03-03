import React from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => (
  <div
    aria-live="polite"
    aria-busy="true"
    className={`inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 ${className}`}
  >
    {children || <span className="w-full h-4 bg-gray-300 rounded-md" />}
  </div>
);

interface SVGSkeletonProps {
  className?: string;
  width?: number;
  height?: number;
}

const SVGSkeleton: React.FC<SVGSkeletonProps> = ({
  className,
  width = 351, // Aggiornato a 351
  height = 114, // Aggiornato a 114
}) => (
  <svg
    className={`animate-pulse rounded bg-gray-300 ${className}`}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100%" height="100%" />
  </svg>
);

export { Skeleton, SVGSkeleton };
