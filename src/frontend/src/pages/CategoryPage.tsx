import { useParams } from '@tanstack/react-router';
import { useGetAllChannels } from '../hooks/useQueries';
import CategoryIcon from '../components/branding/CategoryIcon';
import ChannelGrid from '../components/channels/ChannelGrid';
import AdultRouteGuard from '../components/adult/AdultRouteGuard';
import { getCategoryLabel } from '../utils/category';

function CategoryPageContent() {
  const { categoryName } = useParams({ strict: false });
  const { data: allChannels = [], isLoading } = useGetAllChannels();

  const categoryChannels = allChannels.filter(
    (channel) => channel.category.toLowerCase() === categoryName?.toLowerCase()
  );

  const displayName = categoryName ? getCategoryLabel(categoryName) : 'Category';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <CategoryIcon category={categoryName || 'music'} className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">
            {categoryChannels.length} {categoryChannels.length === 1 ? 'channel' : 'channels'}
          </p>
        </div>
      </div>

      <ChannelGrid
        channels={categoryChannels}
        isLoading={isLoading}
        emptyMessage={`No ${displayName.toLowerCase()} channels available yet.`}
      />
    </div>
  );
}

export default function CategoryPage() {
  const { categoryName } = useParams({ strict: false });

  if (categoryName?.toLowerCase() === 'adult') {
    return (
      <AdultRouteGuard>
        <CategoryPageContent />
      </AdultRouteGuard>
    );
  }

  return <CategoryPageContent />;
}
