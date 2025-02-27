import React from 'react';

type Props = {
  children: React.ReactNode;
};
function ListWrapper({ children }: Props) {
  return (
    <li className='shrink-0 h-full w-[250px] select-none transition-all'>
      {children}
    </li>
  );
}

export default ListWrapper;
