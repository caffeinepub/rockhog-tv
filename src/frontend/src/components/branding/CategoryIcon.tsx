import { Category } from '../../backend';

const categoryIcons: Record<string, string> = {
  music: '/assets/generated/rockhog-cat-music.dim_256x256.png',
  gaming: '/assets/generated/rockhog-cat-gaming.dim_256x256.png',
  sports: '/assets/generated/rockhog-cat-sports.dim_256x256.png',
  horror: '/assets/generated/rockhog-cat-horror.dim_256x256.png',
  adult: '/assets/generated/rockhog-cat-adult.dim_256x256.png',
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export default function CategoryIcon({ category, className = 'w-16 h-16' }: CategoryIconProps) {
  const iconPath = categoryIcons[category.toLowerCase()] || categoryIcons.music;

  return (
    <img
      src={iconPath}
      alt={`${category} category`}
      className={`object-contain ${className}`}
    />
  );
}

