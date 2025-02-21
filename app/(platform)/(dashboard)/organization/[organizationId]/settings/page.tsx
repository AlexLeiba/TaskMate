import { OrganizationProfile } from '@clerk/nextjs';
import React from 'react';

function Settings() {
  return (
    <div className='w-full'>
      <OrganizationProfile
        routing='hash'
        appearance={{
          elements: {
            rootBox: {
              border: 'none',
              width: '100%',
              marginTop: '24px',
            },
            card: {
              border: 'none',
              width: '100%',
            },
          },
        }}
      />
    </div>
  );
}

export default Settings;
