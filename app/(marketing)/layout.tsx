import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
import { Navbar } from './_components/navbar';
import { Footer } from './_components/footer';

function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen bg-slate-100'>
      <ClerkProvider>
        <Navbar />
        <main className='min-h-screen pt-14  bg-slate-100 overflow-y-auto'>
          {children}
        </main>
        <Footer />
      </ClerkProvider>
    </div>
  );
}

export default MarketingLayout;
