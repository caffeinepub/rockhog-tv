import { useGetAllChannels } from '../hooks/useQueries';
import HeroBanner from '../components/branding/HeroBanner';
import CategoryIcon from '../components/branding/CategoryIcon';
import ChannelGrid from '../components/channels/ChannelGrid';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { getAllCategories } from '../utils/category';

export default function BrowseHomePage() {
  const navigate = useNavigate();
  const { data: channels = [], isLoading } = useGetAllChannels();

  const categories = getAllCategories();
  const recentChannels = channels.slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <HeroBanner />

      <section>
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.value}
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
              onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: category.value } })}
            >
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <CategoryIcon category={category.value} className="w-20 h-20 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-center">{category.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {recentChannels.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
          <ChannelGrid channels={recentChannels} isLoading={isLoading} />
        </section>
      )}
    </div>
  );
}
