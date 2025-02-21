import React from 'react';
import OrgControl from './_components/org-control';

// IS USED FOR Using control Fn which checks the url and redirects to the org
function OrganizationIdLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Org control will handle the url with a different org id which will redirect to that org. */}
      <OrgControl />
      {children}
    </>
  );
}

export default OrganizationIdLayout;
