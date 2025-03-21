import React from 'react';
import { ActivityList } from '../Activity/activityList';
import { Attachments as AttachmentsType } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Comments } from '../Comments/comments';
import { Attachments } from '../Attachments/attachments';
import ActivityFetcher from '../Activity/activityFetcher';

type ActivityType = {
  organizationId?: string;
  cardAttachments: AttachmentsType[];
  cardId: string;
  listId: string;
  refetchCardData: () => void;
};
export function CardContentActionTabs({
  organizationId,
  cardAttachments,
  cardId,
  listId,
  refetchCardData,
}: ActivityType) {
  const [tabSelected, setTabSelected] = React.useState('Attachments');

  const tabs = [
    {
      name: 'Attachments',
    },
    {
      name: 'Comments',
    },
    {
      name: 'Activities',
    },
  ];
  return (
    <div>
      <div className='mb-2 w-full flex gap-4'>
        {tabs.map((tab) => {
          return (
            <div
              tabIndex={0}
              role='button'
              key={tab.name}
              className={cn(
                tab.name === tabSelected
                  ? 'border-b dark:border-b-white dark:text-white text-black border-gray-800'
                  : ' dark:text-gray-400 text-gray-500 ',
                'flex gap-2 items-center mb-3 cursor-pointer hover:opacity-80'
              )}
              onClick={() => setTabSelected(tab.name)}
            >
              <p className='body-xs font-semibold'>{tab.name}</p>
            </div>
          );
        })}
      </div>
      {tabSelected === 'Attachments' && (
        <Attachments
          refetchCardData={refetchCardData}
          attachments={cardAttachments}
          cardId={cardId}
          listId={listId}
        />
      )}
      {tabSelected === 'Activities' && <ActivityFetcher cardId={cardId} />}
      {tabSelected === 'Comments' && (
        <Comments cardId={cardId} listId={listId} />
      )}
    </div>
  );
}
