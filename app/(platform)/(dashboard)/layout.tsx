import { Footer } from '@/app/(marketing)/_components/footer';

import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from './dashboard/_components/NavBar';
import { Bounce, ToastContainer } from 'react-toastify';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
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
