import React from 'react';
import { OrganizationList } from '@clerk/nextjs';

function SelectOrgPage() {
  return (
    <div className='flex justify-center items-center h-[calc(100vh-56px)]'>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl={'/organization/:id'}
        afterCreateOrganizationUrl={'/organization/:id'}
      />
    </div>
  );
}

export default SelectOrgPage;
