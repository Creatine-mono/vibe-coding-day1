import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
      <p className="text-amber-300 font-cinzel text-xl tracking-wider">에델가르드가 당신의 운명을 엮고 있습니다...</p>
    </div>
  );
};

export default LoadingSpinner;