import { Footer } from '@/app/(marketing)/_components/footer';

import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from './dashboard/_components/NavBar';
import { ToastContainer } from 'react-toastify';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ToastContainer />
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
