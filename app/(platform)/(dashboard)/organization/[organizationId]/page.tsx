import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Spacer } from '@/components/ui/spacer';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { User } from 'lucide-react';
import { db } from '@/lib/db';
import Board from './_components/board';
import Info from './_components/info';
import CreateNewBoardModal from './_components/CreateNewBoardModal';

async function OrganizationPage({}: {
  params: { organizationId: Promise<string> };
}) {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect('/select-org');
  }

  const boards = await db?.board?.findMany({
    where: {
      orgId: orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='flex flex-col gap-4 w-full'>
      <Spacer size={2} />
      {/* Current board top info */}
      <Info />
      <Separator />

      {/* Your boards */}
      <div>
        <div className='inline-flex flex-col gap-4'>
          <div className='flex gap-x-2 items-center'>
            <User />
            <p className='body-lg font-bold'>Your boards</p>
          </div>

          {/* BOARDS LIST */}
          <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {boards?.map((board) => (
              <Board board={board} key={board.id} />
            ))}

            <CreateNewBoardModal />
          </div>
        </div>
      </div>
      <Spacer size={32} />
    </div>
  );
}

export default OrganizationPage;
