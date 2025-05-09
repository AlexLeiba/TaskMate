import React from 'react';
import Sidebar from '../dashboard/_components/Sidebar';

//IS USED FOR integrating the Sidebar component
function OrganizationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* gap-x-7 - to make space from sidebar to the body content */}
      {/* md:pl-0 - to remove spacing on left of the sidebar on tablet and desktop / on mobile px-4 */}
      <main className='flex gap-x-4 mx-auto max-w-screen-2xl w-full px-4 md:pl-0'>
        {/* SIDEBAR */}
        {/* shrink 0 to prevent the sidebar from shrinking when the screen is resized */}
        {/* sidebar is hidden on mobile size */}
        <div className='w-64 shrink-0 hidden md:block'>
          <Sidebar storageKey={''} />
        </div>

        {children}
      </main>
    </>
  );
}

export default OrganizationLayout;
