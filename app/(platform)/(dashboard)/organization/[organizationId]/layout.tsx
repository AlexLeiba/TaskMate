import React from 'react';
import OrgControl from '../../../../../lib/org-control';
import { auth } from '@clerk/nextjs/server';

export async function generateMetadata() {
  const { orgSlug } = await auth();

  const orgName = orgSlug
    ? orgSlug?.at(0)?.toUpperCase() + orgSlug?.slice(1).replace('-', ' ')
    : 'Organization';

  return {
    title: orgName,
  };
}

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
