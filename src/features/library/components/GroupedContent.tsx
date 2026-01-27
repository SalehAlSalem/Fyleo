/**
 * GroupedContent Component
 * Smart container for grouped and sorted content
 */

import React from 'react';
import type { GroupedData, ViewMode, EnrichedContent } from '../utils/contentHelpers';
import { CollapsibleGroup } from './CollapsibleGroup';
import MaterialCard from './MaterialCard';
import PostCard from './PostCard';
import type { Material } from '../../../types/database';

interface GroupedContentProps {
  groupedData: GroupedData[];
  viewMode: ViewMode;
  onMaterialClick: (material: Material) => void;
  onPostClick: (post: any) => void;
  onBookmark: (id: string) => void;
  bookmarkedIds: Set<string>;
  materialLabels: {
    fileSize: string;
    fileType: string;
    preview: string;
    download: string;
    bookmark: string;
    bookmarked: string;
    info: string;
    description: string;
    size: string;
    type: string;
    downloads: string;
    date: string;
    back: string;
  };
  postLabels: {
    link: string;
    viewPost: string;
  };
}

export const GroupedContent: React.FC<GroupedContentProps> = ({
  groupedData,
  viewMode,
  onMaterialClick,
  // onPostClick, // Not used for now - Posts don't have click handlers
  onBookmark,
  bookmarkedIds,
  materialLabels,
  postLabels,
}) => {
  // Grid classes based on view mode
  const gridClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    list: 'flex flex-col gap-4',
    compact: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3',
  };

  const renderItem = (item: EnrichedContent) => {
    if ('fileName' in item) {
      // Material
      return (
        <MaterialCard
          key={item.$id}
          material={item as Material}
          onBookmark={() => onBookmark(item.$id)}
          isBookmarked={bookmarkedIds.has(item.$id)}
          labels={materialLabels}
          className="card-container"
        />
      );
    } else {
      // Post
      return (
        <PostCard
          key={item.$id}
          post={item as any}
          labels={postLabels}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      {groupedData.map((group, index) => (
        <CollapsibleGroup
          key={`${group.groupName}-${index}`}
          groupName={group.groupName}
          groupIcon={group.groupIcon}
          itemCount={group.items.length}
          defaultExpanded={true}
        >
          <div className={gridClasses[viewMode]}>
            {group.items.map((item) => renderItem(item))}
          </div>
        </CollapsibleGroup>
      ))}
    </div>
  );
};
