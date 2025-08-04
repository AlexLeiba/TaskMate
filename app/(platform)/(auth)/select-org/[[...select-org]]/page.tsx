import React from 'react';
import { OrganizationList } from '@clerk/nextjs';

function SelectOrgPage() {
  return (
    <div className='flex justify-center items-center w-full  dark:bg-gray-700'>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl={'/organization/:id'}
        afterCreateOrganizationUrl={'/organization/:id'}
      />
    </div>
  );
}

export default SelectOrgPage;
