import React, { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default MainContent;