'use client';
import { useEffect } from 'react';
import { useOrganizationList } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

function OrgControl() {
  const params = useParams();
  const { setActive } = useOrganizationList(); //To change the active organization base on the url with ->  org ID

  useEffect(() => {
    if (!setActive) return;

    setActive({ organization: params.organizationId as string });
  }, [params.organizationId, setActive]);
  return null;
}

export default OrgControl;
