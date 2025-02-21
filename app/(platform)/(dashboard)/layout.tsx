import { Footer } from '@/app/(marketing)/_components/footer';

import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from './dashboard/_components/NavBar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className='bg-slate-100'>
        <Navbar />
        <main className='pt-14  bg-slate-100 overflow-y-auto h-screen  '>
          {children}
        </main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}
