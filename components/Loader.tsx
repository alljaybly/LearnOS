
import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};
