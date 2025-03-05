import { auth, currentUser } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { toast } from 'react-toastify';
import { db } from './db';

type Props = {
  entityId: string;
  entityType: ENTITY_TYPE;
  action: ACTIONS;
  entityTitle: string;
};
export async function createActivityLog({
  entityId,
  entityType,
  action,
  entityTitle,
}: Props) {
  const { orgId } = await auth();
  const user = await currentUser();

  try {
    if (!orgId || !user) {
      throw new Error('Org or user not found');
    }

    await db?.activity?.create({
      data: {
        orgId,
        action,
        entityId,
        entityType,
        entityTitle,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + ' ' + user?.lastName,
      },
    });
  } catch (error: any) {
    toast.error(error.message);
  }
}
