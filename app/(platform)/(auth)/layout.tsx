import { Footer } from '@/app/(marketing)/_components/footer';
import { Navbar } from '@/app/(marketing)/_components/navbar';
import { Spacer } from '@/components/ui/spacer';
import { ClerkProvider } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className='flex h-screen flex-col '>
        <Navbar />
        <main className=' bg-slate-100  dark:bg-gray-950  overflow-y-auto flex flex-grow '>
          {children}
        </main>
      </div>
    </ClerkProvider>
  );
}
