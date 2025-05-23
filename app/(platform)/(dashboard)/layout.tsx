import { Footer } from '@/app/(marketing)/_components/footer';

import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from './dashboard/_components/NavBar';
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryProvider } from '@/providers/QueryProvider';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
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
        <div className='bg-slate-100  flex flex-col min-h-screen'>
          <Navbar />
          <main className='pt-14  bg-slate-100 overflow-y-auto flex flex-grow  dark:bg-gray-950'>
            {children}
          </main>
          <Footer />
        </div>
      </QueryProvider>
    </ClerkProvider>
  );
}
