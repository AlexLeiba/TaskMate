import { Footer } from '@/app/(marketing)/_components/footer';
import { Navbar } from '@/app/(marketing)/_components/navbar';
import { ClerkProvider } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* <div className='h-screen bg-slate-100'>
        <main className='pt-14  bg-slate-100 overflow-y-auto'>{children}</main>
      </div> */}

      <Navbar />
      <main className=' bg-slate-100 overflow-y-auto'>{children}</main>

      <Footer />
    </ClerkProvider>
  );
}
