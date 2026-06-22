import React from 'react';
import { View } from 'react-native';
import { SkeletonShimmer } from '../animations/SkeletonShimmer';

interface LoadingSkeletonProps {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: number;
}

export const LoadingSkeleton = ({
  lines = 3,
  lineHeight = 16,
  lastLineWidth = 60,
}: LoadingSkeletonProps) => {
  return (
    <View className="gap-3 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonShimmer
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? `${lastLineWidth}%` : '100%'}
        />
      ))}
    </View>
  );
};
