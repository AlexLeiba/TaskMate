import React from 'react';
import { Spacer } from '@/components/ui/spacer';
import Activities from '../_components/Activities';

function ActivitiesPage() {
  return (
    <div className='w-full overflow-y-auto'>
      {/* ACTIVITY */}
      <Spacer size={6} />
      <Activities />
    </div>
  );
}

export default ActivitiesPage;
