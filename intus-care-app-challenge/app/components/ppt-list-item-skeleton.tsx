import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PptListItemSkeleton = () => {
  return (
    <div
      className='ppt-list-item-skeleton card flex flex-row justify-between items-center'>
      <p className="mx-8 my-5 w-1/4">
        <Skeleton count={1} containerClassName='flex-1'/>
      </p>
      <p className="mr-96 my-5 w-1/12">
        <Skeleton count={1} containerClassName="flex-1" />
      </p>
    </div>
  );
};

export default PptListItemSkeleton;