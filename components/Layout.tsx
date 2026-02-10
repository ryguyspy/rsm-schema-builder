
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100 selection:text-indigo-700">
      {children}
    </div>
  );
};
