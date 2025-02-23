import React from 'react';
import Info from './_components/info';
import { Separator } from '@/components/ui/separator';
import BoardList from './_components/boardList';
import { Spacer } from '@/components/ui/spacer';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

async function OrganizationPage({}: // params,
{
  params: { organizationId: Promise<string> };
}) {
  const boards = await db.board.findMany();

  if (!boards) {
    return notFound();
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <Spacer size={2} />
      {/* Current board top info */}
      <Info />
      <Separator />

      {/* Your boards */}
      <div>
        <BoardList boards={boards} />
      </div>
    </div>
  );
}

export default OrganizationPage;
