import React from 'react';
import Header from './Header';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <main className="min-h-[calc(100vh-64px)] p-3 md:p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;


