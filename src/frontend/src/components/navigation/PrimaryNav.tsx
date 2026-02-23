import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Music, Gamepad2, Trophy, Ghost, Lock, Video, Sparkles, MessageCircle } from 'lucide-react';

const categories = [
  { name: 'Music', path: '/category/music', icon: Music },
  { name: 'Gaming', path: '/category/gaming', icon: Gamepad2 },
  { name: 'Sports', path: '/category/sports', icon: Trophy },
  { name: 'Horror', path: '/category/horror', icon: Ghost },
  { name: 'Adult', path: '/category/adult', icon: Lock },
];

export default function PrimaryNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="hidden md:flex items-center gap-1">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = currentPath === category.path;
        
        return (
          <Button
            key={category.name}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: category.path })}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            {category.name}
          </Button>
        );
      })}
      <Button
        variant={currentPath === '/ai-chat' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => navigate({ to: '/ai-chat' })}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        AI Chat
      </Button>
      <Button
        variant={currentPath === '/chat-room' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => navigate({ to: '/chat-room' })}
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Chat Room
      </Button>
      {identity && (
        <Button
          variant={currentPath === '/creator-studio' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate({ to: '/creator-studio' })}
          className="gap-2"
        >
          <Video className="w-4 h-4" />
          Creator Studio
        </Button>
      )}
    </nav>
  );
}
