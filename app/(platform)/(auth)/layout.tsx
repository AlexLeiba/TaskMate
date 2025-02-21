import { ClerkProvider } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className='h-screen bg-slate-100'>
        <main className='pt-14  bg-slate-100 overflow-y-auto'>{children}</main>
      </div>
    </ClerkProvider>
  );
}
